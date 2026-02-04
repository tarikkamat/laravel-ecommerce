<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountOrderController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $orders = $user->orders()
            ->with(['items', 'shipments'])
            ->latest('id')
            ->get();

        return Inertia::render('storefront/accounts/orders/index', [
            'orders' => $orders->map(fn (Order $order) => [
                'id' => $order->id,
                'status' => $order->status,
                'currency' => $order->currency,
                'grandTotal' => (float) $order->grand_total,
                'itemsCount' => (int) $order->items->sum('qty'),
                'createdAt' => $order->created_at?->toIso8601String(),
                'shipment' => $order->shipments->first()
                    ? [
                        'serviceName' => $order->shipments->first()->service_name,
                        'trackingNumber' => $order->shipments->first()->tracking_number,
                    ]
                    : null,
            ])->values()->all(),
            'apiEndpoints' => [
                'ordersIndex' => route('storefront.accounts.orders.index'),
                'orderShow' => route('storefront.accounts.orders.show', ['order' => '__ORDER_ID__']),
                'productsPage' => route('storefront.products.index'),
            ],
        ]);
    }

    public function show(Request $request, Order $order): Response
    {
        $user = $request->user();
        abort_if($order->user_id !== $user?->id, 403);

        $order->loadMissing(['items', 'taxLines', 'shipments', 'addresses', 'payments']);

        return Inertia::render('storefront/accounts/orders/show', [
            'order' => [
                'id' => $order->id,
                'status' => $order->status,
                'currency' => $order->currency,
                'subtotal' => (float) $order->subtotal,
                'taxTotal' => (float) $order->tax_total,
                'shippingTotal' => (float) $order->shipping_total,
                'grandTotal' => (float) $order->grand_total,
                'createdAt' => $order->created_at?->toIso8601String(),
                'items' => $order->items->map(fn ($item) => [
                    'id' => $item->id,
                    'title' => $item->title_snapshot,
                    'qty' => $item->qty,
                    'unitPrice' => (float) ($item->unit_sale_price ?? $item->unit_price),
                    'lineTotal' => (float) $item->line_total,
                ])->values()->all(),
                'taxLines' => $order->taxLines->map(fn ($line) => [
                    'id' => $line->id,
                    'name' => $line->name,
                    'rate' => (float) $line->rate,
                    'baseAmount' => (float) $line->base_amount,
                    'taxAmount' => (float) $line->tax_amount,
                    'scope' => $line->scope,
                ])->values()->all(),
                'shipments' => $order->shipments->map(fn ($shipment) => [
                    'id' => $shipment->id,
                    'provider' => $shipment->provider,
                    'serviceName' => $shipment->service_name,
                    'serviceCode' => $shipment->service_code,
                    'status' => $shipment->shipment_status,
                    'trackingNumber' => $shipment->tracking_number,
                    'shippingTotal' => (float) $shipment->shipping_total,
                ])->values()->all(),
                'addresses' => $order->addresses->map(fn ($address) => [
                    'id' => $address->id,
                    'type' => $address->type,
                    'fullName' => $address->full_name,
                    'phone' => $address->phone,
                    'country' => $address->country,
                    'city' => $address->city,
                    'district' => $address->district,
                    'line1' => $address->line1,
                    'line2' => $address->line2,
                    'postalCode' => $address->postal_code,
                ])->values()->all(),
                'payments' => $order->payments->map(fn ($payment) => [
                    'id' => $payment->id,
                    'provider' => $payment->provider,
                    'status' => $payment->status,
                    'amount' => (float) $payment->amount,
                    'conversationId' => $payment->conversation_id,
                    'transactionId' => $payment->transaction_id,
                    'createdAt' => $payment->created_at?->toIso8601String(),
                ])->values()->all(),
            ],
            'apiEndpoints' => [
                'ordersIndex' => route('storefront.accounts.orders.index'),
                'orderShow' => route('storefront.accounts.orders.show', ['order' => $order->id]),
            ],
        ]);
    }
}
