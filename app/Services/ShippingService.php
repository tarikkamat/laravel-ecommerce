<?php

namespace App\Services;

use App\Integrations\Geliver\GeliverShippingProvider;
use App\Models\Cart;
use App\Settings\ShippingSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Validation\ValidationException;

class ShippingService
{
    private const ADDRESS_SESSION_KEY = 'checkout.address';
    private const BILLING_ADDRESS_SESSION_KEY = 'checkout.billing_address';
    private const SHIPPING_SELECTION_KEY = 'checkout.shipping_selection';
    private const SHIPPING_RATES_KEY = 'checkout.shipping_rates';

    public function __construct(
        private readonly GeliverShippingProvider $provider,
        private readonly ShippingSettings $settings
    ) {}

    /**
     * @param  array<string, mixed>  $address
     * @return array<int, array<string, mixed>>
     */
    public function getRates(Request $request, Cart $cart, array $address): array
    {
        $this->storeAddress($request, $address);

        $rates = $this->provider->getRates($cart, $address);

        $request->session()->put(self::SHIPPING_RATES_KEY, $rates);

        return $rates;
    }

    /**
     * @param  array<string, mixed>  $address
     */
    public function storeAddress(Request $request, array $address): void
    {
        $normalized = [
            'full_name' => (string) Arr::get($address, 'full_name', ''),
            'phone' => Arr::get($address, 'phone'),
            'email' => Arr::get($address, 'email'),
            'country' => (string) Arr::get($address, 'country', 'TR'),
            'city' => (string) Arr::get($address, 'city', ''),
            'district' => Arr::get($address, 'district'),
            'line1' => (string) Arr::get($address, 'line1', ''),
            'line2' => Arr::get($address, 'line2'),
            'postal_code' => Arr::get($address, 'postal_code'),
        ];

        $request->session()->put(self::ADDRESS_SESSION_KEY, $normalized);
    }

    /**
     * @return array<string, mixed>
     */
    public function getStoredAddress(Request $request): array
    {
        /** @var array<string, mixed> $address */
        $address = $request->session()->get(self::ADDRESS_SESSION_KEY, []);

        if (! empty($address)) {
            return $address;
        }

        $fallback = $this->getUserFallbackAddress($request, 'shipping');
        if (empty($fallback)) {
            return [];
        }

        $request->session()->put(self::ADDRESS_SESSION_KEY, $fallback);

        return $fallback;
    }

    /**
     * @param  array<string, mixed>  $address
     */
    public function storeBillingAddress(Request $request, array $address): void
    {
        $normalized = [
            'full_name' => (string) Arr::get($address, 'full_name', ''),
            'phone' => Arr::get($address, 'phone'),
            'email' => Arr::get($address, 'email'),
            'country' => (string) Arr::get($address, 'country', 'TR'),
            'city' => (string) Arr::get($address, 'city', ''),
            'district' => Arr::get($address, 'district'),
            'line1' => (string) Arr::get($address, 'line1', ''),
            'line2' => Arr::get($address, 'line2'),
            'postal_code' => Arr::get($address, 'postal_code'),
        ];

        $request->session()->put(self::BILLING_ADDRESS_SESSION_KEY, $normalized);
    }

    /**
     * @return array<string, mixed>
     */
    public function getStoredBillingAddress(Request $request): array
    {
        /** @var array<string, mixed> $address */
        $address = $request->session()->get(self::BILLING_ADDRESS_SESSION_KEY, []);

        if (! empty($address)) {
            return $address;
        }

        $fallback = $this->getUserFallbackAddress($request, 'billing');
        if (empty($fallback)) {
            return [];
        }

        $request->session()->put(self::BILLING_ADDRESS_SESSION_KEY, $fallback);

        return $fallback;
    }

    public function selectRate(Request $request, string $serviceCode): array
    {
        $rates = $this->getStoredRates($request);

        $selected = collect($rates)->firstWhere('service_code', $serviceCode);

        if (! $selected) {
            throw ValidationException::withMessages([
                'service_code' => 'Secilen kargo servisi bulunamadi.',
            ]);
        }

        $request->session()->put(self::SHIPPING_SELECTION_KEY, $selected);

        return $selected;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getSelectedRate(Request $request): ?array
    {
        /** @var array<string, mixed>|null $selected */
        $selected = $request->session()->get(self::SHIPPING_SELECTION_KEY);

        return $selected;
    }

    public function selectedShippingTotal(Request $request, ?Cart $cart = null): ?float
    {
        $selected = $this->getSelectedRate($request);

        if (! $selected) {
            return null;
        }

        $amount = round((float) ($selected['amount'] ?? 0), 2);

        if ($cart && $this->settings->free_shipping_enabled) {
            $minimum = max(0, (float) $this->settings->free_shipping_minimum);
            $subtotal = $this->cartSubtotal($cart);

            if ($subtotal >= $minimum) {
                return 0.0;
            }
        }

        return $amount;
    }

    public function clearSelections(Request $request): void
    {
        $request->session()->forget([
            self::SHIPPING_SELECTION_KEY,
            self::SHIPPING_RATES_KEY,
        ]);
    }

    public function clearCheckoutSession(Request $request): void
    {
        $request->session()->forget([
            self::ADDRESS_SESSION_KEY,
            self::BILLING_ADDRESS_SESSION_KEY,
            self::SHIPPING_SELECTION_KEY,
            self::SHIPPING_RATES_KEY,
        ]);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function getStoredRates(Request $request): array
    {
        /** @var array<int, array<string, mixed>> $rates */
        $rates = $request->session()->get(self::SHIPPING_RATES_KEY, []);

        return $rates;
    }

    private function cartSubtotal(Cart $cart): float
    {
        return (float) $cart->items->sum(function ($item): float {
            $unit = $item->unit_sale_price_snapshot !== null && (float) $item->unit_sale_price_snapshot > 0
                ? (float) $item->unit_sale_price_snapshot
                : (float) $item->unit_price_snapshot;

            return round($unit * $item->qty, 2);
        });
    }

    /**
     * @return array<string, mixed>
     */
    private function getUserFallbackAddress(Request $request, string $type): array
    {
        $user = $request->user();
        if (! $user) {
            return [];
        }

        $user->loadMissing('addresses');
        $preferred = $user->addresses->firstWhere('type', $type)
            ?? $user->addresses->firstWhere('type', 'shipping')
            ?? $user->addresses->first();

        if (! $preferred) {
            return [];
        }

        return [
            'full_name' => (string) ($preferred->contact_name ?? $user->name ?? ''),
            'phone' => null,
            'email' => $user->email ?? null,
            'country' => (string) ($preferred->country ?? 'TR'),
            'city' => (string) ($preferred->city ?? ''),
            'district' => null,
            'line1' => (string) ($preferred->address ?? ''),
            'line2' => null,
            'postal_code' => $preferred->zip_code ?? null,
        ];
    }
}
