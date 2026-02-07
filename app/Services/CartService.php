<?php

namespace App\Services;

use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class CartService
{
    public function __construct(
        private readonly CartResolver $resolver,
        private readonly CartTotalsService $totalsService,
        private readonly ShippingService $shippingService,
        private readonly DiscountService $discountService
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function summary(Request $request): array
    {
        $cart = $this->resolver->resolve($request, withItems: true);
        $shippingTotal = $this->shippingService->selectedShippingTotal($request, $cart);
        $discount = $this->discountService->getAppliedDiscount($request);
        $totals = $this->totalsService->totals($cart, $shippingTotal, $discount);

        return [
            'cart' => $cart,
            'totals' => $totals,
            'discount' => $this->discountService->discountPayload($discount),
            'items_count' => (int) $cart->items->sum('qty'),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function addItem(Request $request, int $productId, int $qty): array
    {
        $qty = max(1, $qty);
        $product = $this->getPurchasableProduct($productId);
        $cart = $this->resolver->resolve($request, withItems: true);

        $existing = $cart->items->firstWhere('product_id', $product->id);
        $newQty = ($existing?->qty ?? 0) + $qty;

        $this->assertStock($product, $newQty);

        $snapshot = $this->resolver->snapshotFromProduct($product);

        if ($existing) {
            $existing->forceFill([
                'qty' => $newQty,
                ...$snapshot,
            ])->save();
        } else {
            $cart->items()->create([
                'product_id' => $product->id,
                'qty' => $newQty,
                ...$snapshot,
            ]);
        }

        $this->shippingService->clearSelections($request);

        return $this->summary($request);
    }

    /**
     * @return array<string, mixed>
     */
    public function updateItem(Request $request, int $itemId, int $qty): array
    {
        $cart = $this->resolver->resolve($request, withItems: true);
        $item = $this->cartItemOrFail($cart->id, $itemId);

        if ($qty <= 0) {
            $item->delete();
            $this->shippingService->clearSelections($request);

            return $this->summary($request);
        }

        $product = $this->getPurchasableProduct($item->product_id);

        $this->assertStock($product, $qty);

        $item->forceFill([
            'qty' => $qty,
            ...$this->resolver->snapshotFromProduct($product),
        ])->save();

        $this->shippingService->clearSelections($request);

        return $this->summary($request);
    }

    /**
     * @return array<string, mixed>
     */
    public function removeItem(Request $request, int $itemId): array
    {
        $cart = $this->resolver->resolve($request, withItems: true);
        $item = $this->cartItemOrFail($cart->id, $itemId);

        $item->delete();

        $this->shippingService->clearSelections($request);

        return $this->summary($request);
    }

    /**
     * @return array<string, mixed>
     */
    public function clear(Request $request): array
    {
        $cart = $this->resolver->resolve($request, withItems: true);
        $cart->items()->delete();

        $this->shippingService->clearSelections($request);

        return $this->summary($request);
    }

    /**
     * @return array<string, mixed>
     */
    public function applyDiscount(Request $request, string $code): array
    {
        $this->discountService->apply($request, $code);

        return $this->summary($request);
    }

    /**
     * @return array<string, mixed>
     */
    public function removeDiscount(Request $request): array
    {
        $this->discountService->remove($request);

        return $this->summary($request);
    }

    private function cartItemOrFail(int $cartId, int $itemId): CartItem
    {
        $item = CartItem::query()
            ->where('cart_id', $cartId)
            ->whereKey($itemId)
            ->first();

        if (! $item) {
            abort(404);
        }

        return $item;
    }

    private function getPurchasableProduct(int $productId): Product
    {
        $product = Product::query()->findOrFail($productId);

        if (! $product->active) {
            throw ValidationException::withMessages([
                'product_id' => 'Urun aktif degil.',
            ]);
        }

        return $product;
    }

    private function assertStock(Product $product, int $requestedQty): void
    {
        if ($product->stock === null) {
            return;
        }

        if ($requestedQty > (int) $product->stock) {
            throw ValidationException::withMessages([
                'qty' => 'Yeterli stok yok.',
            ]);
        }
    }
}
