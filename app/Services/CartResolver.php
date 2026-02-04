<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class CartResolver
{
    public function currentSessionId(Request $request): string
    {
        return $this->sessionId($request);
    }

    public function peek(Request $request, bool $withItems = true): ?Cart
    {
        $sessionId = $this->sessionId($request);
        $userId = $request->user()?->id;

        $cart = Cart::query()
            ->where('status', 'active')
            ->when($userId, fn ($q) => $q->where('user_id', $userId))
            ->when(! $userId, fn ($q) => $q->whereNull('user_id')->where('session_id', $sessionId))
            ->first();

        if (! $cart) {
            return null;
        }

        if ($withItems) {
            $cart->load(['items.product']);
        }

        return $cart;
    }

    public function resolve(Request $request, bool $withItems = true): Cart
    {
        $sessionId = $this->sessionId($request);
        $userId = $request->user()?->id;

        $query = Cart::query()
            ->where('status', 'active')
            ->when($userId, fn ($q) => $q->where('user_id', $userId))
            ->when(! $userId, fn ($q) => $q->whereNull('user_id')->where('session_id', $sessionId));

        $cart = $query->first();

        if (! $cart) {
            $cart = Cart::create([
                'user_id' => $userId,
                'session_id' => $sessionId,
                'status' => 'active',
                'currency' => 'TRY',
            ]);
        } elseif ($userId && $cart->session_id !== $sessionId) {
            $cart->forceFill(['session_id' => $sessionId])->save();
        }

        if ($withItems) {
            $cart->load(['items.product']);
        }

        return $cart;
    }

    public function mergeGuestCartToUser(Request $request): void
    {
        $user = $request->user();

        if (! $user) {
            return;
        }

        $sessionId = $this->sessionId($request);

        $guestCart = Cart::query()
            ->whereNull('user_id')
            ->where('session_id', $sessionId)
            ->where('status', 'active')
            ->with('items')
            ->first();

        if (! $guestCart) {
            return;
        }

        $userCart = Cart::query()
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->with('items')
            ->first();

        DB::transaction(function () use ($guestCart, $userCart, $user, $sessionId): void {
            if (! $userCart) {
                $guestCart->forceFill([
                    'user_id' => $user->id,
                    'session_id' => $sessionId,
                ])->save();

                return;
            }

            foreach ($guestCart->items as $guestItem) {
                $product = Product::query()->find($guestItem->product_id);

                if (! $product || ! $product->active) {
                    continue;
                }

                $existing = $userCart->items->firstWhere('product_id', $guestItem->product_id);
                $mergedQty = ($existing?->qty ?? 0) + $guestItem->qty;

                if ($product->stock !== null) {
                    $mergedQty = min($mergedQty, max(0, (int) $product->stock));
                }

                if ($mergedQty <= 0) {
                    continue;
                }

                $snapshot = $this->snapshotFromProduct($product);

                if ($existing) {
                    $existing->forceFill([
                        'qty' => $mergedQty,
                        ...$snapshot,
                    ])->save();
                } else {
                    $userCart->items()->create([
                        'product_id' => $product->id,
                        'qty' => $mergedQty,
                        ...$snapshot,
                    ]);
                }
            }

            $guestCart->delete();
        });
    }

    public function snapshotFromProduct(Product $product): array
    {
        return [
            'unit_price_snapshot' => $product->price,
            'unit_sale_price_snapshot' => $product->sale_price,
            'title_snapshot' => $product->title,
            'sku_snapshot' => $product->sku,
            'stock_snapshot' => $product->stock,
        ];
    }

    private function sessionId(Request $request): string
    {
        if (! $request->hasSession()) {
            return (string) ($request->cookies->get(config('session.cookie')) ?? Str::uuid());
        }

        $session = $request->session();
        $cookieSessionId = (string) $request->cookies->get(config('session.cookie'), '');

        if ($cookieSessionId !== '' && $session->getId() !== $cookieSessionId) {
            $session->setId($cookieSessionId);
        }

        if (! $session->isStarted()) {
            $session->start();
        }

        return $session->getId();
    }
}
