<?php

namespace App\Enums;

enum AddressType: string
{
    case BILLING = 'billing';
    case SHIPPING = 'shipping';

    public function label(): string
    {
        return match ($this) {
            self::BILLING => 'Fatura Adresi',
            self::SHIPPING => 'Teslimat Adresi',
        };
    }
}
