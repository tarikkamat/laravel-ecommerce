<?php

namespace App\Integrations\Geliver;

use Geliver\Client as GeliverSdkClient;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RuntimeException;
use App\Settings\ShippingSettings;

class GeliverClient
{
    public function __construct(private readonly ShippingSettings $settings) {}

    public function isConfigured(): bool
    {
        return $this->settings->geliver_enabled
            && (string) $this->settings->geliver_token !== ''
            && (string) $this->settings->geliver_sender_address_id !== '';
    }

    /**
     * Build a configured Geliver SDK client.
     */
    public function client(): GeliverSdkClient
    {
        $token = (string) $this->settings->geliver_token;

        if ($token === '') {
            throw new RuntimeException('Geliver token eksik.');
        }

        return new GeliverSdkClient($token);
    }

    /**
     * @return array<int, array{id: string, label: string, providerCode?: string}>
     */
    public function listProviderAccounts(): array
    {
        $context = $this->settingsContext();

        if (! class_exists(GeliverSdkClient::class)) {
            Log::warning('Geliver provider list skipped: SDK missing.', $context);
            return [];
        }

        if (! $this->settings->geliver_enabled || ($context['token_set'] ?? false) !== true) {
            Log::warning('Geliver provider list skipped: not configured.', $context);
            return [];
        }

        try {
            $result = $this->client()->providers()->listAccounts();
            Log::info('Geliver provider list response received.', [
                ...$context,
                'result_type' => gettype($result),
            ]);
        } catch (\Throwable $e) {
            $errorContext = [
                ...$context,
                'message' => $e->getMessage(),
            ];

            if ($e instanceof \Geliver\ApiException) {
                $errorContext['status'] = $e->status;
                $errorContext['code'] = $e->codeStr;
                $errorContext['additional'] = $e->additionalMessage;
                $errorContext['body'] = $this->truncateBody($e->body);
            }

            Log::error('Geliver provider list failed.', $errorContext);
            return [];
        }

        $items = [];

        if (is_array($result)) {
            $items = is_array($result['data'] ?? null) ? $result['data'] : $result;
        }

        $normalized = [];

        foreach ($items as $item) {
            if (! is_array($item)) {
                continue;
            }

            $id = (string) ($item['id'] ?? $item['providerAccountID'] ?? '');
            if ($id === '') {
                continue;
            }

            $providerCode = (string) ($item['providerCode'] ?? '');
            $label = trim((string) ($item['name'] ?? $item['providerName'] ?? $providerCode));

            if ($label === '') {
                $label = 'Kargo Firması';
            }

            $normalized[] = [
                'id' => $id,
                'label' => $label,
                'providerCode' => $providerCode !== '' ? $providerCode : null,
            ];
        }

        Log::info('Geliver provider list normalized.', [
            ...$context,
            'count' => count($normalized),
        ]);

        return $normalized;
    }

    /**
     * @param  array<string, mixed>  $shipment
     * @return array<string, mixed>|null
     */
    public function createTransaction(array $shipment, ?string $providerAccountId = null): ?array
    {
        if (! class_exists(GeliverSdkClient::class) || ! $this->isConfigured()) {
            return null;
        }

        try {
            $payload = ['shipment' => $shipment];

            if ($providerAccountId !== null && $providerAccountId !== '') {
                $payload['providerAccountID'] = $providerAccountId;
            }

            Log::info('Geliver transaction create requested.', [
                ...$this->settingsContext(),
                'provider_account_id' => $providerAccountId,
                'order_number' => data_get($shipment, 'order.orderNumber'),
            ]);

            /** @var array<string, mixed> $tx */
            $tx = $this->client()->transactions()->create($payload);

            Log::info('Geliver transaction create response received.', [
                ...$this->settingsContext(),
                'transaction_id' => $tx['id'] ?? null,
                'shipment_id' => data_get($tx, 'shipment.id'),
            ]);

            return $tx;
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function settingsContext(): array
    {
        $token = (string) $this->settings->geliver_token;
        $sender = (string) $this->settings->geliver_sender_address_id;

        return [
            'geliver_enabled' => (bool) $this->settings->geliver_enabled,
            'token_set' => $token !== '',
            'sender_set' => $sender !== '',
            'token_suffix' => $token !== '' ? Str::substr($token, -6) : null,
            'sender_suffix' => $sender !== '' ? Str::substr($sender, -6) : null,
        ];
    }

    /**
     * @param  mixed  $body
     * @return mixed
     */
    private function truncateBody($body)
    {
        if (is_string($body)) {
            return Str::limit($body, 1000);
        }

        return $body;
    }

    /**
     * Create a test shipment and return its offers for rate estimation.
     *
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>|null
     */
    public function createTestShipment(array $payload): ?array
    {
        if (! class_exists(GeliverSdkClient::class) || ! $this->isConfigured()) {
            return null;
        }

        $client = $this->client();

        try {
            /** @var array<string, mixed> $shipment */
            $shipment = $client->shipments()->createTest($payload);

            return $shipment;
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * Poll offers until ready.
     *
     * @return array<string, mixed>|null
     */
    public function waitOffers(string $shipmentId, int $intervalSeconds = 1, int $timeoutSeconds = 10): ?array
    {
        if (! class_exists(GeliverSdkClient::class) || ! $this->isConfigured()) {
            return null;
        }

        try {
            /** @var array<string, mixed> $offers */
            $offers = $this->client()->shipments()->waitOffers($shipmentId, $intervalSeconds, $timeoutSeconds);

            return $offers;
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * Accept a Geliver offer and return the created transaction payload.
     *
     * @return array<string, mixed>|null
     */
    public function acceptOffer(string $offerId): ?array
    {
        if ($offerId === '' || ! class_exists(GeliverSdkClient::class) || ! $this->isConfigured()) {
            return null;
        }

        try {
            /** @var array<string, mixed> $tx */
            $tx = $this->client()->transactions()->acceptOffer($offerId);

            return $tx;
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * Download label PDF by URL.
     */
    public function downloadLabelByUrl(string $url): ?string
    {
        if ($url === '' || ! class_exists(GeliverSdkClient::class) || ! $this->isConfigured()) {
            return null;
        }

        try {
            return $this->client()->shipments()->downloadLabelByUrl($url);
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * Download label PDF by shipment id.
     */
    public function downloadLabelByShipmentId(string $shipmentId): ?string
    {
        if ($shipmentId === '' || ! class_exists(GeliverSdkClient::class) || ! $this->isConfigured()) {
            return null;
        }

        try {
            return $this->client()->shipments()->downloadLabel($shipmentId);
        } catch (\Throwable) {
            return null;
        }
    }
}
