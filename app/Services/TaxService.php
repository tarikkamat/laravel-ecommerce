<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Settings\TaxSettings;
use Illuminate\Support\Collection;

class TaxService
{
    public function __construct(private readonly TaxSettings $settings) {}

    public function rate(): float
    {
        return (float) $this->settings->default_rate;
    }

    public function pricesIncludeTax(): bool
    {
        return (bool) $this->settings->prices_include_tax;
    }

    /**
     * @param  Collection<int, array{cart_item_id:int, base:float}>  $bases
     * @return array{rate:float,total:float,lines:array<int,array<string,mixed>>}
     */
    public function calculateItemTaxes(Cart $cart, Collection $bases): array
    {
        $cart->loadMissing('items.product.categories');
        $defaultRate = $this->rate();
        $categoryRates = $this->categoryRateMap();
        $includeTax = $this->pricesIncludeTax();

        $lines = $bases->map(function (array $row) use ($defaultRate, $categoryRates, $cart, $includeTax): array {
            $cartItem = $cart->items->firstWhere('id', (int) $row['cart_item_id']);
            $rate = $this->resolveItemRate($cartItem, $defaultRate, $categoryRates);
            $gross = round((float) $row['base'], 2);

            if ($includeTax && $rate > 0) {
                $net = round($gross / (1 + $rate), 2);
                $taxAmount = round($gross - $net, 2);
                $baseAmount = $net;
            } else {
                $baseAmount = $gross;
                $taxAmount = round($baseAmount * $rate, 2);
            }

            return [
                'cart_item_id' => $row['cart_item_id'],
                'scope' => 'item',
                'name' => $this->settings->label ?: 'KDV',
                'rate' => $rate,
                'base_amount' => $baseAmount,
                'tax_amount' => $taxAmount,
                'currency' => $cart->currency,
            ];
        })->values()->all();

        $total = round(collect($lines)->sum('tax_amount'), 2);

        return [
            'rate' => $defaultRate,
            'total' => $total,
            'lines' => $lines,
        ];
    }

    /**
     * @param  array<int, float>  $categoryRates
     */
    private function resolveItemRate(?CartItem $item, float $defaultRate, array $categoryRates): float
    {
        if (! $item || ! $item->product) {
            return $defaultRate;
        }

        $rates = $item->product->categories
            ->map(fn ($category) => $categoryRates[$category->id] ?? null)
            ->filter(fn ($rate) => $rate !== null)
            ->map(fn ($rate) => (float) $rate);

        if ($rates->isEmpty()) {
            return $defaultRate;
        }

        return $rates->max() ?? $defaultRate;
    }

    public function rateForProduct(?Product $product): float
    {
        if (! $product) {
            return $this->rate();
        }

        $product->loadMissing('categories');
        $categoryRates = $this->categoryRateMap();
        $defaultRate = $this->rate();

        $rates = $product->categories
            ->map(fn ($category) => $categoryRates[$category->id] ?? null)
            ->filter(fn ($rate) => $rate !== null)
            ->map(fn ($rate) => (float) $rate);

        if ($rates->isEmpty()) {
            return $defaultRate;
        }

        return $rates->max() ?? $defaultRate;
    }

    /**
     * @return array<int, float>
     */
    private function categoryRateMap(): array
    {
        return collect($this->settings->category_rates)
            ->filter(fn ($row) => isset($row['category_id'], $row['rate']))
            ->mapWithKeys(fn ($row) => [(int) $row['category_id'] => (float) $row['rate']])
            ->all();
    }
}
