<?php

namespace App\Integrations\Geliver;

use App\Models\Cart;
use App\Settings\ShippingSettings;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class GeliverShippingProvider
{
    public function __construct(
        private readonly GeliverClient $client,
        private readonly ShippingSettings $settings
    ) {}

    /**
     * @param  array<string, mixed>  $address
     * @return array<int, array<string, mixed>>
     */
    public function getRates(Cart $cart, array $address): array
    {
        $sdkRates = $this->getRatesFromSdk($cart, $address);

        if ($sdkRates !== null && count($sdkRates) > 0) {
            return $sdkRates;
        }

        $flatRate = round((float) $this->settings->flat_rate, 2);
        $flatRateLabel = trim((string) $this->settings->flat_rate_label) !== ''
            ? $this->settings->flat_rate_label
            : (string) config('shipping.flat_rate_label', 'Standart Kargo');

        return [
            [
                'provider' => 'geliver',
                'service_code' => 'flat',
                'service_name' => $flatRateLabel,
                'amount' => $flatRate,
                'raw' => [
                    'source' => 'flat-rate-fallback',
                ],
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $address
     * @return array<int, array<string, mixed>>|null
     */
    private function getRatesFromSdk(Cart $cart, array $address): ?array
    {
        if (! $this->client->isConfigured()) {
            return null;
        }

        $payload = $this->buildShipmentPayload($cart, $address);
        $shipment = $this->client->createTestShipment($payload);

        if (! $shipment) {
            return null;
        }

        $offers = Arr::get($shipment, 'offers');
        $shipmentId = (string) Arr::get($shipment, 'id', '');

        if ((! is_array($offers) || empty($offers['cheapest'])) && $shipmentId !== '') {
            $offers = $this->client->waitOffers($shipmentId) ?? $offers;
        }

        if (! is_array($offers)) {
            return null;
        }

        $offerList = Arr::get($offers, 'list', []);

        $normalizedOffers = collect(is_array($offerList) ? $offerList : [])
            ->filter(fn ($offer) => is_array($offer))
            ->map(fn (array $offer) => $this->mapOffer($offer))
            ->filter()
            ->values()
            ->all();

        if (count($normalizedOffers) > 0) {
            return $normalizedOffers;
        }

        $cheapest = Arr::get($offers, 'cheapest');

        if (is_array($cheapest)) {
            $mapped = $this->mapOffer($cheapest);

            return $mapped ? [$mapped] : null;
        }

        return null;
    }

    /**
     * @param  array<string, mixed>  $address
     * @return array<string, mixed>
     */
    private function buildShipmentPayload(Cart $cart, array $address): array
    {
        $senderAddressId = (string) $this->settings->geliver_sender_address_id;
        $defaults = [
            'city_code' => $this->settings->geliver_default_city_code,
            'distance_unit' => $this->settings->geliver_distance_unit,
            'mass_unit' => $this->settings->geliver_mass_unit,
            'length' => $this->settings->geliver_default_length,
            'width' => $this->settings->geliver_default_width,
            'height' => $this->settings->geliver_default_height,
            'weight' => $this->settings->geliver_default_weight,
        ];
        $cityName = (string) Arr::get($address, 'city', '');
        $cityCode = (string) Arr::get($address, 'city_code', (string) ($defaults['city_code'] ?? '34'));
        $districtName = (string) Arr::get($address, 'district', '');
        $totalAmount = $this->formatMoney($this->cartSubtotal($cart));
        $totalWeight = $this->estimateWeight($cart, (string) ($defaults['weight'] ?? '1.0'));

        return [
            'senderAddressID' => $senderAddressId,
            'recipientAddress' => [
                'name' => (string) Arr::get($address, 'full_name', 'Misafir Kullanici'),
                'email' => (string) Arr::get($address, 'email', 'guest@example.com'),
                'phone' => (string) Arr::get($address, 'phone', '+905350000000'),
                'address1' => (string) Arr::get($address, 'line1', ''),
                'countryCode' => (string) Arr::get($address, 'country', 'TR'),
                'cityName' => $cityName,
                'cityCode' => $cityCode,
                'districtName' => $districtName,
                'zip' => (string) Arr::get($address, 'postal_code', ''),
            ],
            'length' => (string) ($defaults['length'] ?? '10.0'),
            'width' => (string) ($defaults['width'] ?? '10.0'),
            'height' => (string) ($defaults['height'] ?? '10.0'),
            'distanceUnit' => (string) ($defaults['distance_unit'] ?? 'cm'),
            'weight' => $totalWeight,
            'massUnit' => (string) ($defaults['mass_unit'] ?? 'kg'),
            'order' => [
                'orderNumber' => 'CART-'.$cart->id.'-'.Str::upper(Str::random(6)),
                'sourceIdentifier' => (string) $this->settings->geliver_source_identifier,
                'totalAmount' => $totalAmount,
                'totalAmountCurrency' => $cart->currency,
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $offer
     * @return array<string, mixed>|null
     */
    private function mapOffer(array $offer): ?array
    {
        $amount = $this->offerAmount($offer);

        if ($amount <= 0) {
            return null;
        }

        $serviceCode = (string) ($offer['id'] ?? $offer['providerAccountID'] ?? Str::uuid());
        $providerName = (string) ($offer['providerAccountName'] ?? $offer['owner'] ?? 'Geliver');
        $eta = (string) ($offer['averageEstimatedTimeHumanReadible'] ?? '');

        return [
            'provider' => 'geliver',
            'service_code' => $serviceCode,
            'service_name' => trim($providerName.($eta !== '' ? ' • '.$eta : '')),
            'amount' => round($amount, 2),
            'raw' => $offer,
        ];
    }

    private function offerAmount(array $offer): float
    {
        $candidates = [
            $offer['amountLocal'] ?? null,
            $offer['amount'] ?? null,
            $offer['amountLocalTax'] ?? null,
        ];

        foreach ($candidates as $candidate) {
            if ($candidate === null) {
                continue;
            }

            $value = (float) $candidate;

            if ($value > 0) {
                return $value;
            }
        }

        return 0.0;
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

    private function estimateWeight(Cart $cart, string $defaultWeight): string
    {
        $unitWeight = max(0.1, (float) $defaultWeight);
        $qty = max(1, (int) $cart->items->sum('qty'));
        $total = $unitWeight * $qty;

        return number_format($total, 1, '.', '');
    }

    private function formatMoney(float $value): string
    {
        return number_format($value, 2, '.', '');
    }
}
