<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class PaymentSettings extends Settings
{
    public bool $iyzico_enabled = true;
    public string $iyzico_api_key = '';
    public string $iyzico_secret_key = '';
    public string $iyzico_base_url = 'https://sandbox-api.iyzipay.com';
    public string $iyzico_callback_url = '';
    public string $iyzico_webhook_secret = '';

    public static function group(): string
    {
        return 'payments';
    }
}
