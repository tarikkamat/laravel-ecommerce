<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OrderShipment;
use App\Settings\ShippingSettings;
use Geliver\Models\Shipment;
use Geliver\Models\WebhookUpdateTrackingRequest;
use Geliver\Webhooks as GeliverWebhooks;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class GeliverWebhookController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        /** @var ShippingSettings $settings */
        $settings = app(ShippingSettings::class);
        $raw = $request->getContent();
        $headers = $request->headers->all();

        $verified = GeliverWebhooks::verify(
            $raw,
            $headers,
            (bool) $settings->geliver_webhook_verify,
            $settings->geliver_webhook_secret
        );

        if (! $verified) {
            return response()->json(['ok' => false, 'reason' => 'invalid_signature'], 400);
        }

        $payload = json_decode($raw, true) ?: [];
        $event = (string) ($payload['event'] ?? '');
        $data = is_array($payload['data'] ?? null) ? $payload['data'] : [];

        $evt = new WebhookUpdateTrackingRequest();
        $evt->event = $event;
        $evt->metadata = $payload['metadata'] ?? null;
        $evt->data = new Shipment();

        foreach ($data as $key => $value) {
            if (property_exists($evt->data, $key)) {
                $evt->data->{$key} = $value;
            }
        }

        $updated = $this->updateShipmentFromEvent($evt, $payload);

        return response()->json([
            'ok' => true,
            'event' => $event,
            'updated' => $updated,
        ]);
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function updateShipmentFromEvent(WebhookUpdateTrackingRequest $evt, array $payload): bool
    {
        $trackingNumber = (string) ($evt->data->trackingNumber ?? '');
        $shipmentId = (string) ($evt->data->id ?? '');
        $trackingStatus = $evt->data->trackingStatus ?? null;

        $shipment = $this->findShipment($trackingNumber, $shipmentId);

        if (! $shipment) {
            return false;
        }

        $statusCode = is_object($trackingStatus)
            ? (string) ($trackingStatus->trackingStatusCode ?? '')
            : '';
        $subStatusCode = is_object($trackingStatus)
            ? (string) ($trackingStatus->trackingSubStatusCode ?? '')
            : '';

        $status = $statusCode !== ''
            ? trim($statusCode.($subStatusCode !== '' ? '.'.$subStatusCode : ''))
            : ($evt->event !== '' ? $evt->event : $shipment->shipment_status);

        $existingPayload = is_array($shipment->shipment_payload) ? $shipment->shipment_payload : [];
        $mergedPayload = [
            ...$existingPayload,
            'last_webhook' => $payload,
        ];

        $shipment->forceFill([
            'tracking_number' => $trackingNumber !== '' ? $trackingNumber : $shipment->tracking_number,
            'shipment_status' => $status !== '' ? $status : $shipment->shipment_status,
            'shipment_payload' => $mergedPayload,
        ])->save();

        return true;
    }

    private function findShipment(string $trackingNumber, string $shipmentId): ?OrderShipment
    {
        $query = OrderShipment::query()->where('provider', 'geliver');

        if ($trackingNumber !== '') {
            $byTracking = (clone $query)->where('tracking_number', $trackingNumber)->first();
            if ($byTracking) {
                return $byTracking;
            }
        }

        if ($shipmentId !== '') {
            $candidate = (clone $query)->latest('id')->get()->first(function (OrderShipment $shipment) use ($shipmentId): bool {
                $payload = is_array($shipment->shipment_payload) ? $shipment->shipment_payload : [];
                $txShipmentId = (string) Arr::get($payload, 'transaction.shipment.id', '');

                return $txShipmentId !== '' && $txShipmentId === $shipmentId;
            });

            if ($candidate) {
                return $candidate;
            }
        }

        return null;
    }
}
