<?php

namespace App\Services;

use App\Integrations\Geliver\GeliverClient;
use App\Integrations\Iyzico\IyzicoPaymentProvider;
use App\Models\Order;
use App\Models\Payment;
use App\Settings\PaymentSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PaymentService
{
    public function __construct(
        private readonly IyzicoPaymentProvider $provider,
        private readonly ShippingService $shippingService,
        private readonly GeliverClient $geliverClient,
        private readonly PaymentSettings $paymentSettings
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function initialize(Order $order, Request $request): array
    {
        if (! $this->paymentSettings->iyzico_enabled) {
            throw ValidationException::withMessages([
                'payment' => 'Iyzico odemeleri su anda kapali.',
            ]);
        }

        $conversationId = (string) Str::uuid();
        $address = $this->shippingService->getStoredAddress($request);

        $context = [
            'order_id' => $order->id,
            'amount' => (float) $order->grand_total,
            'currency' => $order->currency,
            'address' => $address,
            'ip' => $request->ip(),
        ];

        $payment = Payment::query()->create([
            'order_id' => $order->id,
            'provider' => 'iyzico',
            'status' => 'pending',
            'amount' => $order->grand_total,
            'currency' => $order->currency,
            'conversation_id' => $conversationId,
            'raw_request' => $context,
        ]);

        if ($request->hasSession()) {
            $request->session()->put('checkout.payment_id', $payment->id);
        }

        $providerResult = $this->provider->initialize($order, $conversationId, $context);

        $payment->forceFill([
            'status' => (string) ($providerResult['payment_status'] ?? 'pending'),
            'transaction_id' => $providerResult['transaction_id'] ?? null,
            'raw_response' => $providerResult['raw'] ?? $providerResult,
        ])->save();

        return [
            'payment_id' => $payment->id,
            'order_id' => $order->id,
            'conversation_id' => $conversationId,
            ...$providerResult,
        ];
    }

    /**
     * Handle Iyzico callback by retrieving the checkout form result.
     *
     * @return array<string, mixed>
     */
    public function handleCallback(Request $request, string $token): array
    {
        if ($token === '') {
            throw ValidationException::withMessages([
                'token' => 'Iyzico token bos.',
            ]);
        }

        $paymentId = $request->hasSession()
            ? $request->session()->get('checkout.payment_id')
            : null;

        $payment = null;

        if ($paymentId) {
            $payment = Payment::query()->whereKey($paymentId)->first();
        }

        if (! $payment) {
            $payment = Payment::query()
                ->where('provider', 'iyzico')
                ->whereJsonContains('raw_response->token', $token)
                ->latest('id')
                ->first();
        }

        if (! $payment) {
            $payment = Payment::query()
                ->where('provider', 'iyzico')
                ->latest('id')
                ->firstWhere('status', 'pending');
        }

        if (! $payment) {
            throw ValidationException::withMessages([
                'payment' => 'Bekleyen bir odeme bulunamadi.',
            ]);
        }

        $conversationId = (string) $payment->conversation_id;
        $result = $this->provider->retrieve($conversationId, $token);

        $paymentStatus = (string) ($result['payment_status'] ?? 'failure');
        $transactionId = $result['transaction_id'] ?? null;

        $order = $payment->order()->with(['items.product', 'cart', 'shipments'])->first();

        if ($payment->status === 'success' || $order?->status === 'paid') {
            if ($request->hasSession()) {
                $request->session()->forget('checkout.payment_id');
                $this->shippingService->clearCheckoutSession($request);
            }

            return [
                'payment_id' => $payment->id,
                'order_id' => $order?->id,
                'payment_status' => 'success',
            ];
        }

        DB::transaction(function () use ($payment, $paymentStatus, $transactionId, $result, $order): void {
            $payment->forceFill([
                'status' => $paymentStatus === 'success' ? 'success' : 'failure',
                'transaction_id' => $transactionId,
                'raw_webhook' => $result['raw'] ?? $result,
            ])->save();

            if (! $order) {
                return;
            }

            if ($paymentStatus === 'success') {
                foreach ($order->items as $item) {
                    $product = $item->product()->lockForUpdate()->first();

                    if (! $product) {
                        continue;
                    }

                    if ($product->stock !== null) {
                        $newStock = max(0, (int) $product->stock - (int) $item->qty);
                        $product->forceFill(['stock' => $newStock])->save();
                    }
                }

                $order->forceFill(['status' => 'paid'])->save();

                if ($order->cart) {
                    $order->cart->forceFill(['status' => 'converted'])->save();
                    $order->cart->items()->delete();
                }
            } else {
                $order->forceFill(['status' => 'failed'])->save();
            }
        });

        if ($request->hasSession()) {
            $request->session()->forget('checkout.payment_id');
            $this->shippingService->clearCheckoutSession($request);
        }

        if ($paymentStatus === 'success' && $order) {
            $this->acceptGeliverOfferIfNeeded($order);
        }

        return [
            'payment_id' => $payment->id,
            'order_id' => $order?->id,
            'payment_status' => $paymentStatus,
        ];
    }

    /**
     * Basic webhook handler scaffold for Iyzipay callbacks.
     */
    public function handleWebhook(array $payload): void
    {
        $conversationId = (string) ($payload['conversationId'] ?? $payload['conversation_id'] ?? '');

        if ($conversationId === '') {
            return;
        }

        $payment = Payment::query()->where('conversation_id', $conversationId)->first();

        if (! $payment) {
            return;
        }

        $payment->forceFill([
            'raw_webhook' => $payload,
        ])->save();
    }

    private function acceptGeliverOfferIfNeeded(Order $order): void
    {
        $shipment = $order->shipments->first();

        if (! $shipment || $shipment->provider !== 'geliver') {
            return;
        }

        $offerId = (string) ($shipment->service_code ?? '');

        if ($offerId === '' || $offerId === 'flat') {
            return;
        }

        $existingTxId = (string) data_get($shipment->shipment_payload, 'transaction.id', '');
        $statusStr = (string) $shipment->shipment_status;
        if ($existingTxId !== '' || str_contains($statusStr, 'accepted')) {
            return;
        }

        $tx = $this->geliverClient->acceptOffer($offerId);

        if (! $tx) {
            $shipment->forceFill([
                'shipment_status' => 'offer_accept_failed',
            ])->save();

            return;
        }

        $shipmentPayload = [
            'offer_id' => $offerId,
            'transaction' => $tx,
        ];

        $shipmentData = $tx['shipment'] ?? [];

        $shipment->forceFill([
            'shipment_status' => (string) ($shipmentData['status'] ?? 'accepted'),
            'tracking_number' => $shipmentData['trackingNumber'] ?? $shipment->tracking_number,
            'shipment_payload' => $shipmentPayload,
        ])->save();
    }
}
