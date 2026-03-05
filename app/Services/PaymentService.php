<?php

namespace App\Services;

use App\Integrations\Geliver\GeliverClient;
use App\Integrations\Iyzico\IyzicoPaymentProvider;
use App\Integrations\VakifKatilim\VakifKatilimPaymentProvider;
use App\Models\Order;
use App\Models\Payment;
use App\Settings\PaymentSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Mews\Pos\PosInterface;

class PaymentService
{
    public function __construct(
        private readonly IyzicoPaymentProvider $iyzicoProvider,
        private readonly VakifKatilimPaymentProvider $vakifKatilimProvider,
        private readonly ShippingService $shippingService,
        private readonly GeliverClient $geliverClient,
        private readonly PaymentSettings $paymentSettings
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function initialize(Order $order, Request $request): array
    {
        return $this->initializeIyzico($order, $request);
    }

    /**
     * @return array<string, mixed>
     */
    public function initializeIyzico(Order $order, Request $request): array
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

        $providerResult = $this->iyzicoProvider->initialize($order, $conversationId, $context);

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
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    public function initializeVakifKatilim(Order $order, Request $request, array $payload): array
    {
        if (! $this->paymentSettings->vakif_katilim_enabled) {
            throw ValidationException::withMessages([
                'payment' => 'Vakif Katilim odemeleri su anda kapali.',
            ]);
        }

        $missingFields = $this->vakifKatilimProvider->missingConfigFields();
        if ($missingFields !== []) {
            throw ValidationException::withMessages([
                'payment' => 'Vakif Katilim ayarlari eksik: '.implode(', ', $missingFields),
            ]);
        }

        $conversationId = (string) Str::uuid();
        $gatewayOrderId = sprintf('ORD-%d-%s', $order->id, strtoupper(Str::random(6)));
        $installment = $this->sanitizeInstallment($payload['installment'] ?? null);

        $payment = Payment::query()->create([
            'order_id' => $order->id,
            'provider' => 'vakif_katilim',
            'status' => 'pending',
            'amount' => $order->grand_total,
            'currency' => $order->currency,
            'conversation_id' => $conversationId,
            'raw_request' => [],
        ]);

        $callbackUrl = route('storefront.payments.vakif.response', ['payment' => $payment->id]);
        $gatewayOrder = $this->buildVakifGatewayOrder($order, $request, $gatewayOrderId, $callbackUrl, $installment);

        $payment->forceFill([
            'raw_request' => [
                'gateway_order' => $gatewayOrder,
                'installment' => $installment,
                'card_holder' => (string) ($payload['card_holder'] ?? ''),
                'card_number_last4' => substr(preg_replace('/\D+/', '', (string) ($payload['card_number'] ?? '')) ?? '', -4),
            ],
        ])->save();

        try {
            $formData = $this->vakifKatilimProvider->create3DFormData($payment, $payload);

            $payment->forceFill([
                'status' => 'pending',
                'raw_response' => [
                    'provider_status' => 'ready',
                    'payment_status' => 'pending',
                    'form_type' => is_string($formData) ? 'html' : 'form',
                ],
            ])->save();

            return [
                'payment_id' => $payment->id,
                'order_id' => $order->id,
                'conversation_id' => $conversationId,
                'provider_status' => 'ready',
                'payment_status' => 'pending',
                'form_data' => $formData,
            ];
        } catch (\Throwable $e) {
            $payment->forceFill([
                'status' => 'failure',
                'raw_response' => [
                    'provider_status' => 'error',
                    'payment_status' => 'failure',
                    'message' => $e->getMessage(),
                ],
            ])->save();

            return [
                'payment_id' => $payment->id,
                'order_id' => $order->id,
                'conversation_id' => $conversationId,
                'provider_status' => 'error',
                'payment_status' => 'failure',
                'message' => $e->getMessage(),
            ];
        }
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
        $result = $this->iyzicoProvider->retrieve($conversationId, $token);

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

        $this->markPaymentResult($payment, $order, $paymentStatus, $transactionId, $result['raw'] ?? $result);
        $this->finalizeCheckoutSession($request);

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
     * @return array<string, mixed>
     */
    public function handleVakifKatilimCallback(Request $request, ?int $paymentId = null): array
    {
        $payment = $this->resolveVakifPayment($request, $paymentId);

        if (! $payment) {
            throw ValidationException::withMessages([
                'payment' => 'Vakif Katilim odeme kaydi bulunamadi.',
            ]);
        }

        $order = $payment->order()->with(['items.product', 'cart', 'shipments'])->first();

        if ($payment->status === 'success' || $order?->status === 'paid') {
            return [
                'payment_id' => $payment->id,
                'order_id' => $order?->id,
                'payment_status' => 'success',
            ];
        }

        try {
            $providerResult = $this->vakifKatilimProvider->complete3DPayment($payment);
            $paymentStatus = ($providerResult['success'] ?? false) ? 'success' : 'failure';
            $transactionId = data_get($providerResult, 'response.transaction_id')
                ?? data_get($providerResult, 'response.ref_ret_num')
                ?? data_get($providerResult, 'response.remote_order_id');

            $rawResult = [
                'callback_request' => $request->all(),
                'provider_response' => $providerResult['response'] ?? [],
            ];
        } catch (\Throwable $e) {
            $paymentStatus = 'failure';
            $transactionId = null;
            $rawResult = [
                'callback_request' => $request->all(),
                'provider_error' => $e->getMessage(),
            ];
        }

        $this->markPaymentResult($payment, $order, $paymentStatus, $transactionId, $rawResult);
        $this->finalizeCheckoutSession($request);

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

    private function finalizeCheckoutSession(Request $request): void
    {
        if (! $request->hasSession()) {
            return;
        }

        $request->session()->forget('checkout.payment_id');
        $this->shippingService->clearCheckoutSession($request);
    }

    /**
     * @param  array<string, mixed>  $rawResult
     */
    private function markPaymentResult(Payment $payment, ?Order $order, string $paymentStatus, mixed $transactionId, array $rawResult): void
    {
        DB::transaction(function () use ($payment, $order, $paymentStatus, $transactionId, $rawResult): void {
            $isSuccess = $paymentStatus === 'success';

            $payment->forceFill([
                'status' => $isSuccess ? 'success' : 'failure',
                'transaction_id' => $transactionId,
                'raw_webhook' => $rawResult,
            ])->save();

            if (! $order) {
                return;
            }

            if ($isSuccess) {
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
    }

    /**
     * @return array<string, int|string|float|null>
     */
    private function buildVakifGatewayOrder(Order $order, Request $request, string $gatewayOrderId, string $callbackUrl, int $installment): array
    {
        $currency = strtoupper((string) $order->currency) === 'TRY'
            ? PosInterface::CURRENCY_TRY
            : (string) $order->currency;

        $ip = $request->ip();
        if (! filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            $ip = '127.0.0.1';
        }

        return [
            'id' => $gatewayOrderId,
            'amount' => (float) $order->grand_total,
            'currency' => $currency,
            'installment' => $installment,
            'ip' => $ip,
            'success_url' => $callbackUrl,
            'fail_url' => $callbackUrl,
            'lang' => PosInterface::LANG_TR,
        ];
    }

    private function sanitizeInstallment(mixed $installment): int
    {
        if (! is_numeric($installment)) {
            return 0;
        }

        return max(0, (int) $installment);
    }

    private function resolveVakifPayment(Request $request, ?int $paymentId = null): ?Payment
    {
        $paymentId ??= $request->integer('payment', 0);

        if ($paymentId > 0) {
            $payment = Payment::query()
                ->where('provider', 'vakif_katilim')
                ->whereKey($paymentId)
                ->first();

            if ($payment) {
                return $payment;
            }
        }

        $merchantOrderId = (string) ($request->input('MerchantOrderId') ?: $request->query('MerchantOrderId', ''));
        if ($merchantOrderId !== '') {
            $payment = Payment::query()
                ->where('provider', 'vakif_katilim')
                ->where('raw_request->gateway_order->id', $merchantOrderId)
                ->latest('id')
                ->first();

            if ($payment) {
                return $payment;
            }
        }

        return Payment::query()
            ->where('provider', 'vakif_katilim')
            ->latest('id')
            ->firstWhere('status', 'pending');
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

        $existingPayload = is_array($shipment->shipment_payload) ? $shipment->shipment_payload : [];
        $shipmentPayload = [
            ...$existingPayload,
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
