<?php

namespace App\Enums;

enum PageType: string
{
    case CONTRACT = 'contract';
    case FLAT = 'flat';
    case CONTACT = 'contact';

    public function label(): string
    {
        return match ($this) {
            self::CONTRACT => 'Sözleşme',
            self::FLAT => 'Düz Sayfa',
            self::CONTACT => 'İletişim',
        };
    }
}
