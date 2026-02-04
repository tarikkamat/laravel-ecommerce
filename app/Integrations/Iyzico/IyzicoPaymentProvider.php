<?php

namespace App\Integrations\Iyzico;

use App\Settings\PaymentSettings;
use App\Models\Order;
use App\Models\OrderAddress;
use Iyzipay\Model\Address;
use Iyzipay\Model\BasketItem;
use Iyzipay\Model\BasketItemType;
use Iyzipay\Model\Buyer;
use Iyzipay\Model\CheckoutForm;
use Iyzipay\Model\CheckoutFormInitialize;
use Iyzipay\Model\Currency;
use Iyzipay\Model\Locale;
use Iyzipay\Model\PaymentGroup;
use Iyzipay\Request\CreateCheckoutFormInitializeRequest;
use Iyzipay\Request\RetrieveCheckoutFormRequest;
use RuntimeException;

class IyzicoPaymentProvider
{
    public function __construct(
        private readonly IyzicoClient $client,
        private readonly PaymentSettings $settings
    ) {}

    /**
     * Initialize Iyzico Checkout Form and return redirect URL + token.
     *
     * @param  array<string, mixed>  $context
     * @return array<string, mixed>
     */
    public function initialize(Order $order, string $conversationId, array $context = []): array
    {
        if (! $this->client->isSdkAvailable()) {
            return [
                'provider_status' => 'unavailable',
                'payment_status' => 'pending',
                'message' => 'Iyzipay SDK kurulumu veya konfig eksik.',
                'redirect_url' => null,
                'token' => null,
                'raw' => [
                    'reason' => 'sdk_missing',
                    'config' => $this->client->config(),
                    'context' => $context,
                ],
            ];
        }

        $order->loadMissing(['items', 'addresses', 'user']);

        try {
            $options = $this->client->options();
            $request = new CreateCheckoutFormInitializeRequest();

            $request->setLocale(Locale::TR);
            $request->setConversationId($conversationId);
            $request->setPrice($this->money($order->grand_total));
            $request->setPaidPrice($this->money($order->grand_total));
            $request->setCurrency(Currency::TL);
            $request->setBasketId((string) $order->id);
            $request->setPaymentGroup(PaymentGroup::PRODUCT);
            $request->setCallbackUrl($this->callbackUrl());

            $buyer = $this->mapBuyer($order, $context);
            $request->setBuyer($buyer);

            [$shippingAddress, $billingAddress] = $this->mapAddresses($order);
            $request->setShippingAddress($shippingAddress);
            $request->setBillingAddress($billingAddress);

            $request->setBasketItems($this->mapBasketItems($order));

            $result = CheckoutFormInitialize::create($request, $options);

            $status = strtolower((string) $result->getStatus());
            $isSuccess = $status === 'success';

            return [
                'provider_status' => $isSuccess ? 'ready' : 'error',
                'payment_status' => $isSuccess ? 'pending' : 'failed',
                'message' => $isSuccess
                    ? 'Iyzico odeme formu hazir.'
                    : (string) ($result->getErrorMessage() ?: 'Iyzico initialize hatasi.'),
                'redirect_url' => $result->getPaymentPageUrl(),
                'token' => $result->getToken(),
                'transaction_id' => null,
                'raw' => [
                    'status' => $result->getStatus(),
                    'error_code' => $result->getErrorCode(),
                    'error_message' => $result->getErrorMessage(),
                    'conversation_id' => $result->getConversationId(),
                    'token' => $result->getToken(),
                    'payment_page_url' => $result->getPaymentPageUrl(),
                    'raw_result' => $result->getRawResult(),
                ],
            ];
        } catch (RuntimeException $e) {
            return [
                'provider_status' => 'error',
                'payment_status' => 'failed',
                'message' => $e->getMessage(),
                'redirect_url' => null,
                'token' => null,
                'raw' => [
                    'reason' => 'config_invalid',
                ],
            ];
        } catch (\Throwable $e) {
            \Log::error('Iyzico initialize exception', [
                'order_id' => $order->id,
                'message' => $e->getMessage(),
                'exception' => get_class($e),
                'trace' => $e->getTraceAsString(),
            ]);

            $message = 'Iyzico initialize sirasinda beklenmeyen hata.';
            if (config('app.debug')) {
                $message .= ' ' . $e->getMessage();
            }

            return [
                'provider_status' => 'error',
                'payment_status' => 'failed',
                'message' => $message,
                'redirect_url' => null,
                'token' => null,
                'raw' => [
                    'reason' => 'exception',
                    'exception' => $e->getMessage(),
                ],
            ];
        }
    }

    /**
     * Retrieve checkout form result using token.
     *
     * @return array<string, mixed>
     */
    public function retrieve(string $conversationId, string $token): array
    {
        if (! $this->client->isSdkAvailable()) {
            return [
                'provider_status' => 'unavailable',
                'payment_status' => 'pending',
                'raw' => [
                    'reason' => 'sdk_missing',
                ],
            ];
        }

        try {
            $options = $this->client->options();
            $request = new RetrieveCheckoutFormRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($conversationId);
            $request->setToken($token);

            $result = CheckoutForm::retrieve($request, $options);

            $paymentStatus = strtolower((string) $result->getPaymentStatus());
            $isPaid = in_array($paymentStatus, ['success', 'paid'], true);

            return [
                'provider_status' => strtolower((string) $result->getStatus()) === 'success' ? 'ready' : 'error',
                'payment_status' => $isPaid ? 'success' : 'failure',
                'transaction_id' => $result->getPaymentId(),
                'raw' => [
                    'status' => $result->getStatus(),
                    'error_code' => $result->getErrorCode(),
                    'error_message' => $result->getErrorMessage(),
                    'conversation_id' => $result->getConversationId(),
                    'payment_status' => $result->getPaymentStatus(),
                    'payment_id' => $result->getPaymentId(),
                    'raw_result' => $result->getRawResult(),
                ],
            ];
        } catch (\Throwable $e) {
            return [
                'provider_status' => 'error',
                'payment_status' => 'failure',
                'raw' => [
                    'reason' => 'exception',
                    'exception' => $e->getMessage(),
                ],
            ];
        }
    }

    /**
     * @param  array<string, mixed>  $context
     */
    private function mapBuyer(Order $order, array $context): Buyer
    {
        $address = $order->addresses->firstWhere('type', 'billing')
            ?? $order->addresses->firstWhere('type', 'shipping');

        $fullName = (string) ($address?->full_name ?? 'Misafir Kullanici');
        [$name, $surname] = $this->splitName($fullName);

        $buyer = new Buyer();
        $buyer->setId((string) ($order->user_id ?? 'guest-'.$order->id));
        $buyer->setName($name);
        $buyer->setSurname($surname);
        $buyer->setGsmNumber($this->normalizeGsm((string) ($address?->phone ?? '')));
        $buyer->setEmail((string) ($order->user?->email ?? 'guest@example.com'));
        $buyer->setIdentityNumber('11111111111');
        $buyer->setLastLoginDate(now()->format('Y-m-d H:i:s'));
        $buyer->setRegistrationDate($order->created_at?->format('Y-m-d H:i:s') ?? now()->format('Y-m-d H:i:s'));
        $buyer->setRegistrationAddress((string) ($address?->line1 ?? ''));
        $buyer->setIp((string) ($context['ip'] ?? request()->ip() ?? '127.0.0.1'));
        $buyer->setCity((string) ($address?->city ?? 'Istanbul'));
        $buyer->setCountry($this->mapCountry((string) ($address?->country ?? 'TR')));
        $buyer->setZipCode((string) ($address?->postal_code ?? '34000'));

        return $buyer;
    }

    /**
     * @return array{0:Address,1:Address}
     */
    private function mapAddresses(Order $order): array
    {
        $shipping = $order->addresses->firstWhere('type', 'shipping');
        $billing = $order->addresses->firstWhere('type', 'billing') ?? $shipping;

        return [
            $this->toIyzicoAddress($shipping),
            $this->toIyzicoAddress($billing),
        ];
    }

    private function toIyzicoAddress(?OrderAddress $address): Address
    {
        $addressModel = new Address();
        $addressModel->setContactName((string) ($address?->full_name ?? 'Misafir Kullanici'));
        $addressModel->setCity((string) ($address?->city ?? 'Istanbul'));
        $addressModel->setCountry($this->mapCountry((string) ($address?->country ?? 'TR')));
        $addressModel->setAddress((string) ($address?->line1 ?? ''));
        $addressModel->setZipCode((string) ($address?->postal_code ?? '34000'));

        return $addressModel;
    }

    /**
     * Basket items must sum to request price/paidPrice (grand_total).
     * Product lines use line_subtotal; KDV and Kargo added as separate lines so total matches.
     *
     * @return array<int, BasketItem>
     */
    private function mapBasketItems(Order $order): array
    {
        $items = [];

        foreach ($order->items as $item) {
            $basketItem = new BasketItem();
            $basketItem->setId('item-'.$item->id);
            $basketItem->setName((string) $item->title_snapshot);
            $basketItem->setCategory1('Genel');
            $basketItem->setCategory2('Urun');
            $basketItem->setItemType(BasketItemType::PHYSICAL);
            $basketItem->setPrice($this->money($item->line_subtotal));
            $items[] = $basketItem;
        }

        $taxTotal = (float) $order->tax_total;
        if ($taxTotal > 0) {
            $taxItem = new BasketItem();
            $taxItem->setId('tax');
            $taxItem->setName('KDV');
            $taxItem->setCategory1('Genel');
            $taxItem->setCategory2('Vergi');
            $taxItem->setItemType(BasketItemType::VIRTUAL);
            $taxItem->setPrice($this->money($taxTotal));
            $items[] = $taxItem;
        }

        $shippingTotal = (float) $order->shipping_total;
        if ($shippingTotal > 0) {
            $shippingItem = new BasketItem();
            $shippingItem->setId('shipping');
            $shippingItem->setName('Kargo');
            $shippingItem->setCategory1('Genel');
            $shippingItem->setCategory2('Kargo');
            $shippingItem->setItemType(BasketItemType::VIRTUAL);
            $shippingItem->setPrice($this->money($shippingTotal));
            $items[] = $shippingItem;
        }

        return $items;
    }

    private function callbackUrl(): string
    {
        $configured = (string) $this->settings->iyzico_callback_url;

        if ($configured !== '') {
            return $configured;
        }

        return route('storefront.payments.iyzico.callback');
    }

    private function money($value): string
    {
        return number_format((float) $value, 2, '.', '');
    }

    /**
     * @return array{0:string,1:string}
     */
    private function splitName(string $fullName): array
    {
        $parts = array_values(array_filter(explode(' ', trim($fullName))));

        if (count($parts) <= 1) {
            return [$parts[0] ?? 'Misafir', 'Kullanici'];
        }

        $name = array_shift($parts);
        $surname = implode(' ', $parts);

        return [$name, $surname];
    }

    private function normalizeGsm(string $phone): string
    {
        $digits = preg_replace('/\D+/', '', $phone) ?? '';

        if ($digits === '') {
            return '+905350000000';
        }

        if (str_starts_with($digits, '90')) {
            return '+'.$digits;
        }

        if (str_starts_with($digits, '0')) {
            $digits = substr($digits, 1);
        }

        if (! str_starts_with($digits, '5')) {
            return '+90'.$digits;
        }

        return '+90'.$digits;
    }

    private function mapCountry(string $countryCode): string
    {
        return strtoupper($countryCode) === 'TR' ? 'Turkey' : $countryCode;
    }
}
