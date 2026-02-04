<?php

namespace App\Integrations\Iyzico;

use App\Settings\PaymentSettings;
use Iyzipay\Options;
use RuntimeException;

class IyzicoClient
{
    public function __construct(private readonly PaymentSettings $settings) {}

    /**
     * @return array<string, mixed>
     */
    public function config(): array
    {
        return [
            'api_key' => $this->settings->iyzico_api_key,
            'secret_key' => $this->settings->iyzico_secret_key,
            'base_url' => $this->settings->iyzico_base_url,
        ];
    }

    public function isSdkAvailable(): bool
    {
        return class_exists(Options::class);
    }

    public function options(): Options
    {
        $apiKey = (string) $this->settings->iyzico_api_key;
        $secretKey = (string) $this->settings->iyzico_secret_key;
        $baseUrl = (string) $this->settings->iyzico_base_url;

        if ($apiKey === '' || $secretKey === '' || $baseUrl === '') {
            throw new RuntimeException('Iyzico konfig eksik: api key, secret key veya base url bos.');
        }

        $options = new Options();
        $options->setApiKey($apiKey);
        $options->setSecretKey($secretKey);
        $options->setBaseUrl($baseUrl);

        return $options;
    }
}
