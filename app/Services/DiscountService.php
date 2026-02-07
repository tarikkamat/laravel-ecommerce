<?php

namespace App\Services;

use App\Enums\DiscountType;
use App\Models\Discount;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class DiscountService
{
    private const SESSION_KEY = 'cart.discount_code';

    public function apply(Request $request, string $code): Discount
    {
        $normalized = $this->normalizeCode($code);

        if ($normalized === '') {
            throw ValidationException::withMessages([
                'code' => 'Kupon kodu zorunludur.',
            ]);
        }

        $discount = $this->findActiveDiscount($normalized);
        $this->assertUsageAvailable($discount);

        $request->session()->put(self::SESSION_KEY, $discount->code);

        return $discount;
    }

    public function remove(Request $request): void
    {
        $request->session()->forget(self::SESSION_KEY);
    }

    public function getAppliedDiscount(Request $request): ?Discount
    {
        $code = $this->getAppliedCode($request);

        if (! $code) {
            return null;
        }

        $discount = $this->findActiveDiscount($code, throwOnMissing: false);

        if (! $discount) {
            $this->remove($request);

            return null;
        }

        if (! $this->isUsageAvailable($discount)) {
            $this->remove($request);

            return null;
        }

        return $discount;
    }

    public function getAppliedCode(Request $request): ?string
    {
        $value = $request->session()->get(self::SESSION_KEY);

        if (! is_string($value) || trim($value) === '') {
            return null;
        }

        return $this->normalizeCode($value);
    }

    public function discountPayload(?Discount $discount): ?array
    {
        if (! $discount) {
            return null;
        }

        $type = $discount->type instanceof DiscountType
            ? $discount->type->value
            : (string) $discount->type;

        return [
            'id' => $discount->id,
            'code' => $discount->code,
            'title' => $discount->title,
            'description' => $discount->description,
            'type' => $type,
            'value' => (float) $discount->value,
        ];
    }

    public function calculateDiscountTotal(?Discount $discount, float $subtotal): float
    {
        if (! $discount || $subtotal <= 0) {
            return 0.0;
        }

        $subtotal = max(0, $subtotal);
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

    private function normalizeCode(string $code): string
    {
        return strtoupper(trim($code));
    }

    private function findActiveDiscount(string $code, bool $throwOnMissing = true): ?Discount
    {
        $discount = Discount::query()
            ->where('code', $code)
            ->first();

        if (! $discount || ! $this->isActive($discount)) {
            if ($throwOnMissing) {
                throw ValidationException::withMessages([
                    'code' => 'Kupon kodu gecersiz.',
                ]);
            }

            return null;
        }

        return $discount;
    }

    private function isActive(Discount $discount): bool
    {
        $now = now();

        if ($discount->starts_at && $discount->starts_at->isFuture()) {
            return false;
        }

        if ($discount->ends_at && $discount->ends_at->isPast()) {
            return false;
        }

        return true;
    }

    private function assertUsageAvailable(Discount $discount): void
    {
        if (! $this->isUsageAvailable($discount)) {
            throw ValidationException::withMessages([
                'code' => 'Kupon kodu kullanim limiti doldu.',
            ]);
        }
    }

    private function isUsageAvailable(Discount $discount): bool
    {
        $limit = $discount->usage_limit;

        if ($limit === null || (int) $limit <= 0) {
            return true;
        }

        return $this->usageCount($discount) < (int) $limit;
    }

    private function usageCount(Discount $discount): int
    {
        return Order::query()
            ->where('discount_code', $discount->code)
            ->whereNotIn('status', ['cancelled', 'refunded'])
            ->count();
    }
}
