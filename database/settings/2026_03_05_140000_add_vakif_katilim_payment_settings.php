<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->addIfMissing('payments.vakif_katilim_enabled', false);
        $this->addIfMissing('payments.vakif_katilim_merchant_id', '');
        $this->addIfMissing('payments.vakif_katilim_terminal_id', '');
        $this->addIfMissing('payments.vakif_katilim_user_name', '');
        $this->addIfMissing('payments.vakif_katilim_enc_key', '');
        $this->addIfMissing('payments.vakif_katilim_test_mode', true);
        $this->addIfMissing('payments.vakif_katilim_disable_3d_hash_check', false);
        $this->addIfMissing('payments.vakif_katilim_payment_api', 'https://boa.vakifkatilim.com.tr/VirtualPOS.Gateway/Home');
        $this->addIfMissing('payments.vakif_katilim_gateway_3d', 'https://boa.vakifkatilim.com.tr/VirtualPOS.Gateway/Home/ThreeDModelPayGate');
        $this->addIfMissing('payments.vakif_katilim_gateway_3d_host', 'https://boa.vakifkatilim.com.tr/VirtualPOS.Gateway/CommonPaymentPage/CommonPaymentPage');
    }

    private function addIfMissing(string $property, mixed $value): void
    {
        if (! $this->migrator->exists($property)) {
            $this->migrator->add($property, $value);
        }
    }
};
