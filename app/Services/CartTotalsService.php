<?php

namespace App\Services;

use App\Enums\DiscountType;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Discount;
use Illuminate\Support\Collection;

class CartTotalsService
{
    public function __construct(
        private readonly TaxService $taxService,
        private readonly ShippingService $shippingService
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function totals(Cart $cart, ?float $shippingTotal = null, ?Discount $discount = null): array
    {
        $items = $cart->items->map(function (CartItem $item): array {
            $unitEffective = $this->effectiveUnitPrice($item);
            $lineSubtotal = round($unitEffective * $item->qty, 2);

            return [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'qty' => $item->qty,
                'title' => $item->title_snapshot,
                'sku' => $item->sku_snapshot,
                'unit_price' => (float) $item->unit_price_snapshot,
                'unit_sale_price' => $item->unit_sale_price_snapshot !== null
                    ? (float) $item->unit_sale_price_snapshot
                    : null,
                'unit_effective' => $unitEffective,
                'line_subtotal' => $lineSubtotal,
            ];
        })->values();

        $subtotal = round($items->sum('line_subtotal'), 2);

        $taxBases = $items->map(fn (array $row) => [
            'cart_item_id' => (int) $row['id'],
            'base' => (float) $row['line_subtotal'],
        ]);

        $taxResult = $this->taxService->calculateItemTaxes($cart, $taxBases);

        $discountTotal = $this->discountTotal($discount, $subtotal);

        $resolvedShipping = $shippingTotal !== null
            ? round($shippingTotal, 2)
            : 0.0;

        $includeTax = $this->taxService->pricesIncludeTax();
        $grandTotal = $includeTax
            ? round($subtotal + $resolvedShipping - $discountTotal, 2)
            : round($subtotal + $taxResult['total'] + $resolvedShipping - $discountTotal, 2);

        return [
            'currency' => $cart->currency,
            'items' => $items->all(),
            'subtotal' => $subtotal,
            'discount_total' => $discountTotal,
            'tax_total' => $taxResult['total'],
            'tax_lines' => $taxResult['lines'],
            'shipping_total' => $resolvedShipping,
            'grand_total' => $grandTotal,
        ];
    }

    private function effectiveUnitPrice(CartItem $item): float
    {
        if ($item->unit_sale_price_snapshot !== null) {
            $sale = (float) $item->unit_sale_price_snapshot;

            if ($sale > 0) {
                return round($sale, 2);
            }
        }

        return round((float) $item->unit_price_snapshot, 2);
    }

    private function discountTotal(?Discount $discount, float $subtotal): float
    {
        if (! $discount || $subtotal <= 0) {
            return 0.0;
        }

        $value = (float) $discount->value;

        $type = $discount->type instanceof DiscountType
            ? $discount->type
            : DiscountType::tryFrom((string) $discount->type);

        if ($type === DiscountType::PERCENTAGE) {
            $rate = max(0, min(100, $value));
            $amount = $subtotal * ($rate / 100);
        } else {
            $amount = max(0, $value);
        }

        return round(min($amount, $subtotal), 2);
    }
}
