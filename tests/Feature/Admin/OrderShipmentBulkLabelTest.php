<?php

use App\Enums\Role;
use App\Integrations\Geliver\GeliverClient;
use App\Models\Order;
use App\Models\OrderShipment;
use App\Models\User;

test('admin can download bulk geliver labels without revalidating local order addresses', function () {
    $admin = User::query()->create([
        'name' => 'Admin',
        'email' => 'admin@example.com',
        'email_verified_at' => now(),
        'password' => 'password',
        'role' => Role::ADMIN,
    ]);

    $order = Order::query()->create([
        'status' => 'paid',
        'currency' => 'TRY',
        'subtotal' => 100,
        'shipping_total' => 10,
        'grand_total' => 110,
    ]);

    $shipment = OrderShipment::query()->create([
        'order_id' => $order->id,
        'provider' => 'geliver',
        'service_code' => 'offer-123',
        'service_name' => 'Geliver Test',
        'shipping_total' => 10,
        'shipment_status' => 'draft',
        'shipment_payload' => [],
    ]);

    $geliver = \Mockery::mock(GeliverClient::class);
    $geliver->shouldReceive('isConfigured')->once()->andReturn(true);
    $geliver->shouldReceive('acceptOffer')->once()->with('offer-123')->andReturn([
        'id' => 'tx-123',
        'shipment' => [
            'id' => 'shipment-123',
            'labelURL' => 'https://labels.example/shipment-123.pdf',
            'status' => 'accepted',
            'trackingNumber' => 'TRK123',
        ],
    ]);
    $geliver->shouldReceive('downloadLabelByUrl')->once()->with('https://labels.example/shipment-123.pdf')->andReturn('%PDF-1.4 test label');

    $this->instance(GeliverClient::class, $geliver);

    $response = $this
        ->actingAs($admin)
        ->post(route('admin.orders.shipments.labels'), [
            'shipment_ids' => [$shipment->id],
        ]);

    $response->assertOk();
    $response->assertDownload('kargo-fisleri.zip');

    $shipment->refresh();

    expect($shipment->shipment_status)->toBe('accepted');
    expect($shipment->tracking_number)->toBe('TRK123');
    expect(data_get($shipment->shipment_payload, 'transaction.id'))->toBe('tx-123');
});
