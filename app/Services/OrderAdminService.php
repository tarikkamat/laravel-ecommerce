<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderAdminService
{
    public function markPaid(Order $order): Order
    {
        if ($order->status === 'paid') {
            return $order->fresh();
        }

        if (in_array($order->status, ['cancelled', 'refunded'], true)) {
            throw ValidationException::withMessages([
                'status' => 'İptal/iade edilmiş sipariş ödenmişe çekilemez.',
            ]);
        }

        return DB::transaction(function () use ($order): Order {
            $this->reduceStock($order);

            $order->forceFill([
                'status' => 'paid',
            ])->save();

            return $order->fresh();
        });
    }

    public function markFailed(Order $order): Order
    {
        if ($order->status === 'failed') {
            return $order->fresh();
        }

        if (in_array($order->status, ['paid', 'cancelled', 'refunded'], true)) {
            throw ValidationException::withMessages([
                'status' => 'Bu sipariş başarısız durumuna alınamaz.',
            ]);
        }

        return DB::transaction(function () use ($order): Order {
            $order->forceFill([
                'status' => 'failed',
            ])->save();

            return $order->fresh();
        });
    }

    public function cancel(Order $order, ?string $reason = null): Order
    {
        if ($order->status === 'cancelled') {
            throw ValidationException::withMessages([
                'status' => 'Sipariş zaten iptal edilmiş.',
            ]);
        }

        if ($order->status === 'refunded') {
            throw ValidationException::withMessages([
                'status' => 'İade edilmiş sipariş iptal edilemez.',
            ]);
        }

        if ($order->status === 'paid') {
            throw ValidationException::withMessages([
                'status' => 'Ödenmiş sipariş iptal edilemez. İade olarak işleyin.',
            ]);
        }

        return DB::transaction(function () use ($order, $reason): Order {
            $order->forceFill([
                'status' => 'cancelled',
                'cancelled_at' => now(),
                'cancel_reason' => $reason,
            ])->save();

            return $order->fresh();
        });
    }

    public function refund(Order $order, ?string $reason = null): Order
    {
        if ($order->status === 'refunded') {
            throw ValidationException::withMessages([
                'status' => 'Sipariş zaten iade edilmiş.',
            ]);
        }

        if ($order->status === 'cancelled') {
            throw ValidationException::withMessages([
                'status' => 'İptal edilmiş sipariş iade edilemez.',
            ]);
        }

        if (! in_array($order->status, ['paid', 'shipped', 'delivered'], true)) {
            throw ValidationException::withMessages([
                'status' => 'Sadece ödenmiş siparişler iade edilebilir.',
            ]);
        }

        return DB::transaction(function () use ($order, $reason): Order {
            $this->restoreStock($order);

            $order->forceFill([
                'status' => 'refunded',
                'refunded_at' => now(),
                'refund_reason' => $reason,
            ])->save();

            return $order->fresh();
        });
    }

    private function restoreStock(Order $order): void
    {
        $order->loadMissing(['items', 'items.product']);

        foreach ($order->items as $item) {
            $product = $item->product;

            if (! $product instanceof Product) {
                continue;
            }

            if ($product->stock === null) {
                continue;
            }

            $locked = Product::query()->lockForUpdate()->find($product->id);

            if (! $locked || $locked->stock === null) {
                continue;
            }

            $locked->forceFill([
                'stock' => (int) $locked->stock + (int) $item->qty,
            ])->save();
        }
    }

    private function reduceStock(Order $order): void
    {
        $order->loadMissing(['items', 'items.product']);

        foreach ($order->items as $item) {
            $product = $item->product;

            if (! $product instanceof Product) {
                continue;
            }

            if ($product->stock === null) {
                continue;
            }

            $locked = Product::query()->lockForUpdate()->find($product->id);

            if (! $locked || $locked->stock === null) {
                continue;
            }

            $locked->forceFill([
                'stock' => max(0, (int) $locked->stock - (int) $item->qty),
            ])->save();
        }
    }
}
