<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\OrderShipmentBulkLabelRequest;
use App\Http\Requests\Admin\OrderShipmentUpdateRequest;
use App\Integrations\Geliver\GeliverClient;
use App\Models\Order;
use App\Models\OrderShipment;
use Illuminate\Support\Facades\File;
use Illuminate\Validation\ValidationException;
use ZipArchive;

class OrderShipmentController extends Controller
{
    public function __construct(private readonly GeliverClient $geliverClient) {}

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

        $shipments = OrderShipment::query()
            ->whereIn('id', $shipmentIds)
            ->where('provider', 'geliver')
            ->get();

        if ($shipments->isEmpty()) {
            throw ValidationException::withMessages([
                'shipment_ids' => 'Kargo fişi bulunamadı.',
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
            $label = $this->resolveLabel($shipment);
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
}
