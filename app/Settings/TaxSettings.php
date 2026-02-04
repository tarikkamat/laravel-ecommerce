<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class TaxSettings extends Settings
{
    public float $default_rate = 0.2;
    public string $label = 'KDV';

    public array $category_rates = [];

    public static function group(): string
    {
        return 'tax';
    }
}
