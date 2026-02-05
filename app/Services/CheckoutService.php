<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use App\Settings\TaxSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CheckoutService
{
    public function __construct(
        private readonly CartResolver $resolver,
        private readonly CartTotalsService $totalsService,
        private readonly ShippingService $shippingService,
        private readonly TaxService $taxService,
        private readonly TaxSettings $taxSettings
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function summary(Request $request): array
    {
        $cart = $this->resolver->resolve($request, withItems: true);
        $shippingTotal = $this->shippingService->selectedShippingTotal($request, $cart);
        $totals = $this->totalsService->totals($cart, $shippingTotal);

        return [
            'address' => $this->shippingService->getStoredAddress($request),
            'selected_shipping' => $this->shippingService->getSelectedRate($request),
            'totals' => $totals,
            'items_count' => (int) $cart->items->sum('qty'),
        ];
    }

    /**
     * @param  array<string, mixed>  $address
     * @return array<string, mixed>
     */
    public function storeAddress(Request $request, array $address): array
    {
        $this->assertAddress($address);
        $this->shippingService->storeAddress($request, $address);

        return $this->summary($request);
    }

    /**
     * @return array<string, mixed>
     */
    public function getRates(Request $request): array
    {
        $cart = $this->resolver->resolve($request, withItems: true);
        $this->assertCartNotEmpty($cart->items->count());

        $address = $this->shippingService->getStoredAddress($request);
        $this->assertAddress($address);

        $rates = $this->shippingService->getRates($request, $cart, $address);

        return [
            'rates' => $rates,
            ...$this->summary($request),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function selectShipping(Request $request, string $serviceCode): array
    {
        $selected = $this->shippingService->selectRate($request, $serviceCode);

        return [
            'selected_shipping' => $selected,
            ...$this->summary($request),
        ];
    }

    /**
     * Create a pending-payment order from the current cart.
     */
    public function confirm(Request $request): Order
    {
        $cart = $this->resolver->resolve($request, withItems: true);
        $this->assertCartNotEmpty($cart->items->count());

        $address = $this->shippingService->getStoredAddress($request);
        $this->assertAddress($address);

        $selectedShipping = $this->shippingService->getSelectedRate($request);

        if (! $selectedShipping) {
            throw ValidationException::withMessages([
                'shipping' => 'Lutfen bir kargo secimi yapin.',
            ]);
        }

        $taxLabel = $this->taxSettings->label ?: 'KDV';
        $shippingTotal = round((float) ($selectedShipping['amount'] ?? 0), 2);

        return DB::transaction(function () use ($cart, $address, $selectedShipping, $shippingTotal, $taxLabel, $request): Order {
            $order = Order::query()->create([
                'user_id' => $request->user()?->id,
                'cart_id' => $cart->id,
                'status' => 'pending_payment',
                'currency' => $cart->currency,
                'subtotal' => 0,
                'discount_total' => 0,
                'tax_total' => 0,
                'shipping_total' => $shippingTotal,
                'grand_total' => 0,
            ]);

            $order->addresses()->create([
                'type' => 'shipping',
                'full_name' => (string) $address['full_name'],
                'phone' => $address['phone'] ?? null,
                'country' => (string) $address['country'],
                'city' => (string) $address['city'],
                'district' => $address['district'] ?? null,
                'line1' => (string) $address['line1'],
                'line2' => $address['line2'] ?? null,
                'postal_code' => $address['postal_code'] ?? null,
            ]);

            $order->addresses()->create([
                'type' => 'billing',
                'full_name' => (string) $address['full_name'],
                'phone' => $address['phone'] ?? null,
                'country' => (string) $address['country'],
                'city' => (string) $address['city'],
                'district' => $address['district'] ?? null,
                'line1' => (string) $address['line1'],
                'line2' => $address['line2'] ?? null,
                'postal_code' => $address['postal_code'] ?? null,
            ]);

            $subtotal = 0.0;
            $taxTotal = 0.0;
            $includeTax = (bool) $this->taxSettings->prices_include_tax;

            foreach ($cart->items as $cartItem) {
                $product = Product::query()->findOrFail($cartItem->product_id);

                if (! $product->active) {
                    throw ValidationException::withMessages([
                        'product_id' => 'Urun aktif degil.',
                    ]);
                }

                if ($product->stock !== null && $cartItem->qty > (int) $product->stock) {
                    throw ValidationException::withMessages([
                        'qty' => 'Stok degisti. Sepeti guncelleyin.',
                    ]);
                }

                $unitPrice = (float) $product->price;
                $unitSalePrice = $product->sale_price !== null ? (float) $product->sale_price : null;
                $unitEffective = $unitSalePrice !== null && $unitSalePrice > 0 ? $unitSalePrice : $unitPrice;
                $lineSubtotal = round($unitEffective * $cartItem->qty, 2);
                $lineRate = $this->taxService->rateForProduct($product);

                if ($includeTax && $lineRate > 0) {
                    $taxBase = round($lineSubtotal / (1 + $lineRate), 2);
                    $lineTaxTotal = round($lineSubtotal - $taxBase, 2);
                    $lineTotal = $lineSubtotal;
                } else {
                    $taxBase = $lineSubtotal;
                    $lineTaxTotal = round($lineSubtotal * $lineRate, 2);
                    $lineTotal = round($lineSubtotal + $lineTaxTotal, 2);
                }

                $orderItem = $order->items()->create([
                    'product_id' => $product->id,
                    'qty' => $cartItem->qty,
                    'unit_price' => $unitPrice,
                    'unit_sale_price' => $unitSalePrice,
                    'line_subtotal' => $lineSubtotal,
                    'line_tax_total' => $lineTaxTotal,
                    'line_total' => $lineTotal,
                    'title_snapshot' => $product->title,
                    'sku_snapshot' => $product->sku,
                ]);

                $order->taxLines()->create([
                    'order_item_id' => $orderItem->id,
                    'scope' => 'item',
                    'name' => $taxLabel,
                    'rate' => $lineRate,
                    'base_amount' => $taxBase,
                    'tax_amount' => $lineTaxTotal,
                ]);

                $subtotal = round($subtotal + $lineSubtotal, 2);
                $taxTotal = round($taxTotal + $lineTaxTotal, 2);
            }

            $grandTotal = $includeTax
                ? round($subtotal + $shippingTotal, 2)
                : round($subtotal + $taxTotal + $shippingTotal, 2);

            $order->shipments()->create([
                'provider' => (string) ($selectedShipping['provider'] ?? 'geliver'),
                'service_code' => (string) ($selectedShipping['service_code'] ?? 'flat'),
                'service_name' => (string) ($selectedShipping['service_name'] ?? 'Standart Kargo'),
                'shipping_total' => $shippingTotal,
                'shipment_status' => 'draft',
                'shipment_payload' => $selectedShipping,
            ]);

            $order->forceFill([
                'subtotal' => $subtotal,
                'tax_total' => $taxTotal,
                'shipping_total' => $shippingTotal,
                'grand_total' => $grandTotal,
            ])->save();

            return $order->fresh(['items', 'addresses', 'shipments', 'taxLines']);
        });
    }

    /**
     * @param  array<string, mixed>  $address
     */
    private function assertAddress(array $address): void
    {
        $required = ['full_name', 'country', 'city', 'line1'];

        foreach ($required as $key) {
            $value = trim((string) ($address[$key] ?? ''));

            if ($value === '') {
                throw ValidationException::withMessages([
                    $key => 'Bu alan zorunludur.',
                ]);
            }
        }
    }

    private function assertCartNotEmpty(int $count): void
    {
        if ($count === 0) {
            throw ValidationException::withMessages([
                'cart' => 'Sepet bos.',
            ]);
        }
    }
}
