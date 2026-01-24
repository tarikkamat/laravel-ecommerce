<?php

namespace App\Enums;

enum DiscountType: string
{
    case PERCENTAGE = 'percentage';
    case FIXED_AMOUNT = 'fixed_amount';

    public function label(): string
    {
        return match ($this) {
            DiscountType::PERCENTAGE => 'Yüzde',
            DiscountType::FIXED_AMOUNT => 'Sabit Tutar',
        };
    }
}
