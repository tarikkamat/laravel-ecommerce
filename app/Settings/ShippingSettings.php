<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class ShippingSettings extends Settings
{
    public bool $free_shipping_enabled = false;
    public float $free_shipping_minimum = 0.0;

    public bool $geliver_enabled = true;
    public string $geliver_token = '';
    public string $geliver_sender_address_id = '';
    public string $geliver_source_identifier = '';
    public bool $geliver_webhook_verify = false;
    public string $geliver_webhook_secret = '';

    public string $geliver_default_city_code = '34';
    public string $geliver_distance_unit = 'cm';
    public string $geliver_mass_unit = 'kg';
    public float $geliver_default_length = 10.0;
    public float $geliver_default_width = 10.0;
    public float $geliver_default_height = 10.0;
    public float $geliver_default_weight = 1.0;

    public static function group(): string
    {
        return 'shipping';
    }
}
