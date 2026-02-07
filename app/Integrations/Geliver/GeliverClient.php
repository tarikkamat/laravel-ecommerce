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
        Log::warning('Geliver provider list disabled: marketplace flow only.', $this->settingsContext());

        return [];
    }

    /**
     * @param  array<string, mixed>  $shipment
     * @return array<string, mixed>|null
     */
    public function createTransaction(array $shipment, ?string $providerAccountId = null): ?array
    {
        Log::warning('Geliver createTransaction disabled: marketplace flow only.', [
            ...$this->settingsContext(),
            'provider_account_id' => $providerAccountId,
            'order_number' => data_get($shipment, 'order.orderNumber'),
        ]);

        return null;
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
    public function createShipment(array $payload): ?array
    {
        if (! class_exists(GeliverSdkClient::class) || ! $this->isConfigured()) {
            return null;
        }

        $client = $this->client();
        $context = $this->requestContext([
            'order_number' => data_get($payload, 'order.orderNumber'),
            'sender_address_id' => data_get($payload, 'senderAddressID'),
        ]);

        try {
            /** @var array<string, mixed> $shipment */
            $shipment = $client->shipments()->create($payload);

            return $shipment;
        } catch (\Geliver\ApiException $e) {
            $this->logApiException('Geliver shipment create failed.', $context, $e);
            return null;
        } catch (\Throwable $e) {
            $this->logThrowable('Geliver shipment create failed.', $context, $e);
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

        $context = $this->requestContext([
            'shipment_id' => $shipmentId,
            'interval_seconds' => $intervalSeconds,
            'timeout_seconds' => $timeoutSeconds,
        ]);

        try {
            /** @var array<string, mixed> $offers */
            $offers = $this->client()->shipments()->waitOffers($shipmentId, $intervalSeconds, $timeoutSeconds);

            return $offers;
        } catch (\Geliver\ApiException $e) {
            $this->logApiException('Geliver wait offers failed.', $context, $e);
            return null;
        } catch (\Throwable $e) {
            $this->logThrowable('Geliver wait offers failed.', $context, $e);
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

        $context = $this->requestContext([
            'offer_id' => $offerId,
        ]);

        try {
            /** @var array<string, mixed> $tx */
            $tx = $this->client()->transactions()->acceptOffer($offerId);

            return $tx;
        } catch (\Geliver\ApiException $e) {
            $this->logApiException('Geliver accept offer failed.', $context, $e);
            return null;
        } catch (\Throwable $e) {
            $this->logThrowable('Geliver accept offer failed.', $context, $e);
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

        $context = $this->requestContext([
            'label_url_suffix' => Str::substr($url, -32),
        ]);

        try {
            return $this->client()->shipments()->downloadLabelByUrl($url);
        } catch (\Geliver\ApiException $e) {
            $this->logApiException('Geliver label download by url failed.', $context, $e);
            return null;
        } catch (\Throwable $e) {
            $this->logThrowable('Geliver label download by url failed.', $context, $e);
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

        $context = $this->requestContext([
            'shipment_id' => $shipmentId,
        ]);

        try {
            return $this->client()->shipments()->downloadLabel($shipmentId);
        } catch (\Geliver\ApiException $e) {
            $this->logApiException('Geliver label download by shipment id failed.', $context, $e);
            return null;
        } catch (\Throwable $e) {
            $this->logThrowable('Geliver label download by shipment id failed.', $context, $e);
            return null;
        }
    }

    /**
     * @param  array<string, mixed>  $extra
     * @return array<string, mixed>
     */
    private function requestContext(array $extra = []): array
    {
        return [
            ...$this->settingsContext(),
            ...$extra,
        ];
    }

    /**
     * @param  array<string, mixed>  $context
     */
    private function logApiException(string $message, array $context, \Geliver\ApiException $e): void
    {
        Log::error($message, [
            ...$context,
            'status' => $e->status,
            'code' => $e->codeStr,
            'additional' => $e->additionalMessage,
            'body' => $this->truncateBody($e->body),
            'message' => $e->getMessage(),
        ]);
    }

    /**
     * @param  array<string, mixed>  $context
     */
    private function logThrowable(string $message, array $context, \Throwable $e): void
    {
        Log::error($message, [
            ...$context,
            'message' => $e->getMessage(),
            'exception' => get_class($e),
        ]);
    }
}
