<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(private readonly PaymentService $paymentService) {}

    public function initialize(Request $request): JsonResponse
    {
        $data = $request->validate([
            'order_id' => ['required', 'integer', 'exists:orders,id'],
        ]);

        $order = Order::query()
            ->with(['cart', 'items', 'addresses', 'taxLines', 'shipments'])
            ->findOrFail((int) $data['order_id']);

        $this->authorizeOrder($request, $order);
        abort_if($order->status !== 'pending_payment', 422, 'Siparis odeme icin uygun degil.');

        $result = $this->paymentService->initialize($order, $request);

        if (! empty($result['redirect_url'])) {
            $request->session()->put('checkout_result_order_id', $order->id);
        }

        return response()->json($result);
    }

    public function webhook(Request $request): JsonResponse
    {
        $payload = $request->all();
        $this->paymentService->handleWebhook($payload);

        return response()->json(['ok' => true]);
    }

    private function authorizeOrder(Request $request, Order $order): void
    {
        $userId = $request->user()?->id;

        if ($userId) {
            abort_if($order->user_id !== $userId, 403);

            return;
        }

        $session = $request->session();
        if (! $session->isStarted()) {
            $session->start();
        }

        $sessionId = $session->getId();
        abort_if($order->cart?->session_id !== $sessionId, 403);
    }
}
