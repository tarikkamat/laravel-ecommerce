<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\OrderActionRequest;
use App\Http\Requests\Admin\OrderStatusUpdateRequest;
use App\Models\Order;
use App\Services\OrderAdminService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function __construct(private readonly OrderAdminService $service) {}

    public function index(Request $request)
    {
        $perPage = (int) $request->integer('per_page', 15);

        $query = Order::query()
            ->with(['user', 'items', 'payments', 'shipments']);

        if ($request->filled('status')) {
            $query->where('status', $request->string('status')->toString());
        }

        if ($request->filled('payment_status')) {
            $paymentStatus = $request->string('payment_status')->toString();
            $query->whereHas('payments', fn ($q) => $q->where('status', $paymentStatus));
        }

        if ($request->filled('order_id')) {
            $query->whereKey((int) $request->integer('order_id'));
        }

        if ($request->filled('customer')) {
            $customer = $request->string('customer')->toString();
            $query->whereHas('user', function ($q) use ($customer) {
                $q->where('email', 'like', '%'.$customer.'%')
                    ->orWhere('name', 'like', '%'.$customer.'%');
            });
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date('date_from'));
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date('date_to'));
        }

        $orders = $query->latest('id')->paginate($perPage)->withQueryString();

        $orders->setCollection(
            $orders->getCollection()->map(function (Order $order): array {
                $payment = $order->payments->sortByDesc('id')->first();
                $shipment = $order->shipments->first();
                $itemsCount = $order->items->sum('qty');

                return [
                    'id' => $order->id,
                    'status' => $order->status,
                    'currency' => $order->currency,
                    'grandTotal' => (float) $order->grand_total,
                    'itemsCount' => (int) $itemsCount,
                    'createdAt' => $order->created_at?->toIso8601String(),
                    'customer' => $order->user
                        ? [
                            'id' => $order->user->id,
                            'name' => $order->user->name ?? $order->user->email,
                            'email' => $order->user->email,
                        ]
                        : null,
                    'paymentStatus' => $payment?->status,
                    'shipmentStatus' => $shipment?->shipment_status,
                    'trackingNumber' => $shipment?->tracking_number,
                    'shipmentId' => $shipment?->id,
                    'shipmentProvider' => $shipment?->provider,
                ];
            })
        );

        return Inertia::render('admin/orders/index', [
            'items' => $orders,
            'filters' => [
                'status' => $request->string('status')->toString(),
                'payment_status' => $request->string('payment_status')->toString(),
                'order_id' => $request->string('order_id')->toString(),
                'customer' => $request->string('customer')->toString(),
                'date_from' => $request->string('date_from')->toString(),
                'date_to' => $request->string('date_to')->toString(),
            ],
            'statusOptions' => $this->statusOptions(),
            'paymentStatusOptions' => $this->paymentStatusOptions(),
        ]);
    }

    public function show(Order $order)
    {
        $order->loadMissing(['user', 'items', 'items.product', 'addresses', 'payments', 'shipments']);

        return Inertia::render('admin/orders/show', [
            'order' => [
                'id' => $order->id,
                'status' => $order->status,
                'currency' => $order->currency,
                'subtotal' => (float) $order->subtotal,
                'taxTotal' => (float) $order->tax_total,
                'shippingTotal' => (float) $order->shipping_total,
                'grandTotal' => (float) $order->grand_total,
                'createdAt' => $order->created_at?->toIso8601String(),
                'cancelledAt' => $order->cancelled_at?->toIso8601String(),
                'refundedAt' => $order->refunded_at?->toIso8601String(),
                'cancelReason' => $order->cancel_reason,
                'refundReason' => $order->refund_reason,
                'customer' => $order->user
                    ? [
                        'id' => $order->user->id,
                        'name' => $order->user->name ?? $order->user->email,
                        'email' => $order->user->email,
                    ]
                    : null,
                'items' => $order->items->map(fn ($item) => [
                    'id' => $item->id,
                    'title' => $item->title_snapshot,
                    'qty' => (int) $item->qty,
                    'unitPrice' => (float) ($item->unit_sale_price ?? $item->unit_price),
                    'lineTotal' => (float) $item->line_total,
                    'product' => $item->product
                        ? [
                            'id' => $item->product->id,
                            'title' => $item->product->title,
                        ]
                        : null,
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
                    'currency' => $payment->currency,
                    'conversationId' => $payment->conversation_id,
                    'transactionId' => $payment->transaction_id,
                    'createdAt' => $payment->created_at?->toIso8601String(),
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
            ],
            'statusOptions' => $this->statusOptions(),
            'shipmentStatusOptions' => $this->shipmentStatusOptions(),
        ]);
    }

    public function update(OrderStatusUpdateRequest $request, Order $order)
    {
        $status = $request->string('status')->toString();
        $reason = $request->string('reason')->toString();

        if ($status === 'cancelled') {
            $this->service->cancel($order, $reason !== '' ? $reason : null);
        } elseif ($status === 'refunded') {
            $this->service->refund($order, $reason !== '' ? $reason : null);
        } elseif ($status === 'paid') {
            $this->service->markPaid($order);
        } elseif ($status === 'failed') {
            $this->service->markFailed($order);
        } else {
            $order->forceFill(['status' => $status])->save();
        }

        return redirect()->route('admin.orders.show', $order);
    }

    public function cancel(OrderActionRequest $request, Order $order)
    {
        $reason = $request->string('reason')->toString();
        $this->service->cancel($order, $reason !== '' ? $reason : null);

        return redirect()->route('admin.orders.show', $order);
    }

    public function refund(OrderActionRequest $request, Order $order)
    {
        $reason = $request->string('reason')->toString();
        $this->service->refund($order, $reason !== '' ? $reason : null);

        return redirect()->route('admin.orders.show', $order);
    }

    private function statusOptions(): array
    {
        return [
            ['value' => 'pending_payment', 'label' => 'Ödeme Bekleniyor'],
            ['value' => 'paid', 'label' => 'Ödendi'],
            ['value' => 'failed', 'label' => 'Başarısız'],
            ['value' => 'cancelled', 'label' => 'İptal'],
            ['value' => 'refunded', 'label' => 'İade'],
        ];
    }

    private function paymentStatusOptions(): array
    {
        return [
            ['value' => 'pending', 'label' => 'Beklemede'],
            ['value' => 'success', 'label' => 'Başarılı'],
            ['value' => 'failure', 'label' => 'Başarısız'],
        ];
    }

    private function shipmentStatusOptions(): array
    {
        return [
            ['value' => 'draft', 'label' => 'Taslak'],
            ['value' => 'accepted', 'label' => 'Kabul Edildi'],
            ['value' => 'shipped', 'label' => 'Kargoya Verildi'],
            ['value' => 'in_transit', 'label' => 'Yolda'],
            ['value' => 'delivered', 'label' => 'Teslim Edildi'],
            ['value' => 'returned', 'label' => 'İade'],
            ['value' => 'cancelled', 'label' => 'İptal'],
        ];
    }
}
