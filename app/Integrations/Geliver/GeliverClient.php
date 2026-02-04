<?php

namespace App\Integrations\Geliver;

use Geliver\Client as GeliverSdkClient;
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
