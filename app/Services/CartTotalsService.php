<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
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
    public function totals(Cart $cart, ?float $shippingTotal = null): array
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

        $resolvedShipping = $shippingTotal !== null
            ? round($shippingTotal, 2)
            : 0.0;

        $grandTotal = round($subtotal + $taxResult['total'] + $resolvedShipping, 2);

        return [
            'currency' => $cart->currency,
            'items' => $items->all(),
            'subtotal' => $subtotal,
            'discount_total' => 0.0,
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
}
