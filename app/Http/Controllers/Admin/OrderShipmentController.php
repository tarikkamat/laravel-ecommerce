<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\OrderShipmentBulkLabelRequest;
use App\Http\Requests\Admin\OrderShipmentUpdateRequest;
use App\Integrations\Geliver\GeliverClient;
use App\Models\Order;
use App\Models\OrderShipment;
use App\Settings\ShippingSettings;
use Illuminate\Support\Facades\File;
use Illuminate\Validation\ValidationException;
use ZipArchive;

class OrderShipmentController extends Controller
{
    public function __construct(
        private readonly GeliverClient $geliverClient,
        private readonly ShippingSettings $shippingSettings
    ) {}

    public function update(OrderShipmentUpdateRequest $request, Order $order, OrderShipment $shipment)
    {
        $this->assertOrderShipment($order, $shipment);

        $shipment->forceFill([
            'shipment_status' => $request->string('shipment_status')->toString() ?: $shipment->shipment_status,
            'tracking_number' => $request->string('tracking_number')->toString() ?: $shipment->tracking_number,
        ])->save();

        return redirect()->route('admin.orders.show', $order);
    }

    public function label(Order $order, OrderShipment $shipment)
    {
        $this->assertOrderShipment($order, $shipment);

        $label = $this->resolveLabel($shipment);

        if (! $label) {
            throw ValidationException::withMessages([
                'shipment' => 'Kargo fişi bulunamadı.',
            ]);
        }

        return response()->streamDownload(
            fn () => print($label['content']),
            $label['filename'],
            ['Content-Type' => 'application/pdf']
        );
    }

    public function labels(OrderShipmentBulkLabelRequest $request)
    {
        $shipmentIds = $request->validated('shipment_ids');
        $providerAccountId = (string) $request->validated('provider_account_id');

        $shipments = OrderShipment::query()
            ->whereIn('id', $shipmentIds)
            ->where('provider', 'geliver')
            ->with(['order.addresses', 'order.user'])
            ->get();

        if ($shipments->isEmpty()) {
            throw ValidationException::withMessages([
                'shipment_ids' => 'Kargo fişi bulunamadı.',
            ]);
        }

        if (! $this->geliverClient->isConfigured()) {
            throw ValidationException::withMessages([
                'shipment_ids' => 'Geliver ayarları tamamlanmamış.',
            ]);
        }

        if ($providerAccountId === '') {
            throw ValidationException::withMessages([
                'provider_account_id' => 'Kargo firması seçimi zorunlu.',
            ]);
        }

        $senderAddressId = (string) $this->shippingSettings->geliver_sender_address_id;

        if ($senderAddressId === '') {
            throw ValidationException::withMessages([
                'shipment_ids' => 'Geliver gönderici adresi ayarlanmamış.',
            ]);
        }

        $invalidOrders = [];

        foreach ($shipments as $shipment) {
            $order = $shipment->order;
            $address = $order?->addresses?->firstWhere('type', 'shipping');
            $phone = trim((string) ($address?->phone ?? ''));
            $line1 = trim((string) ($address?->line1 ?? ''));
            $city = trim((string) ($address?->city ?? ''));

            if (! $order || ! $address || $phone === '' || $line1 === '' || $city === '') {
                $invalidOrders[] = $order?->id ?? $shipment->order_id;
            }
        }

        if ($invalidOrders !== []) {
            $unique = implode(', ', array_unique(array_map('strval', $invalidOrders)));
            throw ValidationException::withMessages([
                'shipment_ids' => 'Eksik adres/telefon bilgisi olan siparişler: '.$unique,
            ]);
        }

        $tmpDir = storage_path('app/tmp');
        File::ensureDirectoryExists($tmpDir);

        $zipPath = $tmpDir.'/labels-'.now()->format('Ymd-His').'.zip';
        $zip = new ZipArchive();

        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            throw ValidationException::withMessages([
                'shipment_ids' => 'Kargo fişi hazırlanamadı.',
            ]);
        }

        $added = 0;

        foreach ($shipments as $shipment) {
            $label = $this->ensureShipmentLabel($shipment, $providerAccountId);
            if (! $label) {
                continue;
            }

            $zip->addFromString($label['filename'], $label['content']);
            $added++;
        }

        $zip->close();

        if ($added === 0) {
            @unlink($zipPath);
            throw ValidationException::withMessages([
                'shipment_ids' => 'Kargo fişi bulunamadı.',
            ]);
        }

        return response()->download($zipPath, 'kargo-fisleri.zip')->deleteFileAfterSend(true);
    }

    private function assertOrderShipment(Order $order, OrderShipment $shipment): void
    {
        if ($shipment->order_id !== $order->id) {
            abort(404);
        }
    }

    /**
     * @return array{content: string, filename: string}|null
     */
    private function resolveLabel(OrderShipment $shipment): ?array
    {
        if ($shipment->provider !== 'geliver') {
            return null;
        }

        $payload = (array) ($shipment->shipment_payload ?? []);
        $labelUrl = data_get($payload, 'transaction.shipment.labelURL')
            ?? data_get($payload, 'transaction.shipment.labelUrl')
            ?? data_get($payload, 'shipment.labelURL')
            ?? data_get($payload, 'shipment.labelUrl')
            ?? data_get($payload, 'labelURL');

        $shipmentId = data_get($payload, 'transaction.shipment.id')
            ?? data_get($payload, 'transaction.shipment.shipmentID')
            ?? data_get($payload, 'shipment.id')
            ?? data_get($payload, 'shipment.shipmentID');

        $content = null;

        if (is_string($labelUrl) && $labelUrl !== '') {
            $content = $this->geliverClient->downloadLabelByUrl($labelUrl);
        } elseif (is_string($shipmentId) && $shipmentId !== '') {
            $content = $this->geliverClient->downloadLabelByShipmentId($shipmentId);
        }

        if (! is_string($content) || $content === '') {
            return null;
        }

        $filename = 'shipment-'.$shipment->id.'.pdf';

        return [
            'content' => $content,
            'filename' => $filename,
        ];
    }

    /**
     * @return array{content: string, filename: string}|null
     */
    private function ensureShipmentLabel(OrderShipment $shipment, string $providerAccountId): ?array
    {
        $label = $this->resolveLabel($shipment);
        if ($label) {
            return $label;
        }

        $payload = $this->buildTransactionPayload($shipment);
        $tx = $this->geliverClient->createTransaction($payload, $providerAccountId);

        if (! $tx) {
            return null;
        }

        $shipmentData = is_array($tx['shipment'] ?? null) ? $tx['shipment'] : [];
        $trackingNumber = (string) ($shipmentData['trackingNumber'] ?? $shipmentData['barcode'] ?? '');
        $status = (string) ($shipmentData['status'] ?? '');

        $existingPayload = is_array($shipment->shipment_payload) ? $shipment->shipment_payload : [];
        $mergedPayload = [
            ...$existingPayload,
            'transaction' => $tx,
            'provider_account_id' => $providerAccountId,
        ];

        $shipment->forceFill([
            'shipment_status' => $status !== '' ? $status : ($shipment->shipment_status ?: 'accepted'),
            'tracking_number' => $trackingNumber !== '' ? $trackingNumber : $shipment->tracking_number,
            'shipment_payload' => $mergedPayload,
        ])->save();

        return $this->resolveLabel($shipment);
    }

    /**
     * @return array<string, mixed>
     */
    private function buildTransactionPayload(OrderShipment $shipment): array
    {
        $order = $shipment->order;
        $address = $order?->addresses?->firstWhere('type', 'shipping');

        if (! $order || ! $address) {
            throw ValidationException::withMessages([
                'shipment_ids' => 'Kargo adresi bulunamadı.',
            ]);
        }

        $recipientName = trim((string) ($address->full_name ?? ''));
        if ($recipientName === '') {
            $recipientName = trim((string) ($order->user?->name ?? $order->user?->email ?? 'Müşteri'));
        }

        $recipient = [
            'name' => $recipientName,
            'email' => $order->user?->email,
            'phone' => (string) $address->phone,
            'address1' => (string) $address->line1,
            'countryCode' => (string) ($address->country ?? 'TR'),
            'cityName' => (string) $address->city,
            'cityCode' => (string) ($this->shippingSettings->geliver_default_city_code ?: '34'),
            'districtName' => (string) ($address->district ?? ''),
            'zip' => (string) ($address->postal_code ?? ''),
        ];

        if (! $recipient['email']) {
            unset($recipient['email']);
        }

        if ($recipient['districtName'] === '') {
            unset($recipient['districtName']);
        }

        if ($recipient['zip'] === '') {
            unset($recipient['zip']);
        }

        return [
            'senderAddressID' => (string) $this->shippingSettings->geliver_sender_address_id,
            'recipientAddress' => $recipient,
            'length' => $this->shippingSettings->geliver_default_length,
            'width' => $this->shippingSettings->geliver_default_width,
            'height' => $this->shippingSettings->geliver_default_height,
            'distanceUnit' => $this->shippingSettings->geliver_distance_unit,
            'weight' => $this->shippingSettings->geliver_default_weight,
            'massUnit' => $this->shippingSettings->geliver_mass_unit,
            'order' => [
                'orderNumber' => 'ORDER-'.$order->id,
                'sourceIdentifier' => (string) $this->shippingSettings->geliver_source_identifier,
                'totalAmount' => $this->formatMoney((float) $order->grand_total),
                'totalAmountCurrency' => (string) $order->currency,
            ],
        ];
    }

    private function formatMoney(float $value): string
    {
        return number_format($value, 2, '.', '');
    }
}
