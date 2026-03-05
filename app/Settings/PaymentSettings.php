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

    public bool $vakif_katilim_enabled = false;

    public string $vakif_katilim_merchant_id = '';

    public string $vakif_katilim_terminal_id = '';

    public string $vakif_katilim_user_name = '';

    public string $vakif_katilim_enc_key = '';

    public bool $vakif_katilim_test_mode = true;

    public bool $vakif_katilim_disable_3d_hash_check = false;

    public string $vakif_katilim_payment_api = 'https://boa.vakifkatilim.com.tr/VirtualPOS.Gateway/Home';

    public string $vakif_katilim_gateway_3d = 'https://boa.vakifkatilim.com.tr/VirtualPOS.Gateway/Home/ThreeDModelPayGate';

    public string $vakif_katilim_gateway_3d_host = 'https://boa.vakifkatilim.com.tr/VirtualPOS.Gateway/CommonPaymentPage/CommonPaymentPage';

    public static function group(): string
    {
        return 'payments';
    }
}
