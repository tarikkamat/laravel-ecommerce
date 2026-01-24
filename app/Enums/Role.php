<?php

namespace App\Enums;

enum Role: string
{
    case ADMIN = 'admin';
    case CUSTOMER = 'customer';

    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Yönetici',
            self::CUSTOMER => 'Müşteri',
        };
    }
}
