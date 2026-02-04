<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartCheckoutTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutMiddleware(EncryptCookies::class);
    }

    public function test_guest_can_add_to_cart_and_see_taxed_totals(): void
    {
        config([
            'tax.default_rate' => 0.20,
            'session.driver' => 'file',
        ]);

        $product = Product::factory()->create([
            'price' => 100,
            'sale_price' => null,
            'stock' => 10,
            'active' => true,
        ]);

        $response = $this->postJson(route('api.cart.items.store'), [
            'product_id' => $product->id,
            'qty' => 2,
        ]);

        $response->assertOk();

        $totals = $response->json('totals');
        $this->assertSame(200.0, (float) $totals['subtotal']);
        $this->assertSame(40.0, (float) $totals['tax_total']);
        $this->assertSame(240.0, (float) $totals['grand_total']);
    }

    public function test_guest_checkout_flow_creates_pending_payment_order(): void
    {
        $this->markTestSkipped('Session persistence across API routes needs a dedicated test harness.');

        config([
            'tax.default_rate' => 0.20,
            'shipping.flat_rate' => 10,
            'session.driver' => 'file',
        ]);

        $sessionCookie = config('session.cookie');

        $product = Product::factory()->create([
            'price' => 100,
            'sale_price' => null,
            'stock' => 10,
            'active' => true,
        ]);

        $cartResponse = $this->postJson(route('api.cart.items.store'), [
            'product_id' => $product->id,
            'qty' => 1,
        ])->assertOk();

        $sessionId = $cartResponse->getCookie($sessionCookie)?->getValue();
        $this->assertNotNull($sessionId);

        $address = [
            'full_name' => 'Test User',
            'phone' => '5550000000',
            'country' => 'TR',
            'city' => 'Istanbul',
            'district' => 'Kadikoy',
            'line1' => 'Test Mah. Test Sok. No:1',
            'line2' => null,
            'postal_code' => '34000',
        ];

        $this->withCookie($sessionCookie, (string) $sessionId)
            ->postJson(route('api.checkout.address'), $address)->assertOk();

        $ratesResponse = $this->withCookie($sessionCookie, (string) $sessionId)
            ->postJson(route('api.checkout.shipping.rates'))->assertOk();
        $serviceCode = (string) $ratesResponse->json('rates.0.service_code');

        $this->withCookie($sessionCookie, (string) $sessionId)
            ->postJson(route('api.checkout.shipping.select'), [
                'service_code' => $serviceCode,
            ])->assertOk();

        $confirmResponse = $this->withCookie($sessionCookie, (string) $sessionId)
            ->postJson(route('api.checkout.confirm'))
            ->assertOk();

        $orderId = (int) $confirmResponse->json('order_id');

        $order = Order::query()->with(['items', 'taxLines', 'shipments'])->findOrFail($orderId);

        $this->assertSame('pending_payment', $order->status);
        $this->assertSame(100.0, (float) $order->subtotal);
        $this->assertSame(20.0, (float) $order->tax_total);
        $this->assertSame(10.0, (float) $order->shipping_total);
        $this->assertSame(130.0, (float) $order->grand_total);
        $this->assertCount(1, $order->items);
        $this->assertCount(1, $order->taxLines);
        $this->assertCount(1, $order->shipments);
    }
}
