<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\CartResolver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutResultController extends Controller
{
    public function __construct(private readonly CartResolver $cartResolver) {}

    public function __invoke(Request $request, Order $order): Response
    {
        $order->loadMissing(['items', 'taxLines', 'shipments', 'addresses', 'cart']);

        $this->authorizeOrder($request, $order);

        $paymentStatus = null;
        if ($request->hasValidSignature()) {
            $cached = Cache::pull("checkout_result_{$order->id}");
            $paymentStatus = $cached['paymentStatus'] ?? null;
        }

        return Inertia::render('storefront/checkout/result', [
            'paymentStatus' => $paymentStatus,
            'order' => [
                'id' => $order->id,
                'status' => $order->status,
                'currency' => $order->currency,
                'subtotal' => (float) $order->subtotal,
                'taxTotal' => (float) $order->tax_total,
                'shippingTotal' => (float) $order->shipping_total,
                'grandTotal' => (float) $order->grand_total,
                'items' => $order->items->map(fn ($item) => [
                    'id' => $item->id,
                    'title' => $item->title_snapshot,
                    'qty' => $item->qty,
                    'lineTotal' => (float) $item->line_total,
                ])->values()->all(),
            ],
            'apiEndpoints' => [
                'cartPage' => route('storefront.cart.index'),
                'checkoutPage' => route('storefront.checkout.index'),
                'productsPage' => route('storefront.products.index'),
            ],
        ]);
    }

    private function authorizeOrder(Request $request, Order $order): void
    {
        // Allow when returning from payment callback via signed URL (no session write, preserves auth)
        if ($request->hasValidSignature()) {
            return;
        }

        $userId = $request->user()?->id;

        if ($userId) {
            if ($order->user_id === $userId) {
                return;
            }
        } else {
            $sessionId = $this->cartResolver->currentSessionId($request);
            if ($order->cart?->session_id === $sessionId) {
                return;
            }
        }

        // Fallback: one-time view when session was set (e.g. from API initialize before redirect to Iyzico)
        $allowedOrderId = (int) $request->session()->pull('checkout_result_order_id', 0);
        if ($allowedOrderId > 0 && $order->id === $allowedOrderId) {
            return;
        }

        abort(403);
    }
}
