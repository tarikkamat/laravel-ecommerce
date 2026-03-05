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

        $order = $this->resolvePendingOrder($request, (int) $data['order_id']);

        $result = $this->paymentService->initialize($order, $request);

        if (! empty($result['redirect_url'])) {
            $request->session()->put('checkout_result_order_id', $order->id);
        }

        return response()->json($result);
    }

    public function initializeVakifKatilim(Request $request): JsonResponse
    {
        $data = $request->validate([
            'order_id' => ['required', 'integer', 'exists:orders,id'],
            'card_holder' => ['required', 'string', 'max:255'],
            'card_number' => ['required', 'string', 'max:24', 'regex:/^[0-9\\s-]{12,24}$/'],
            'card_exp_month' => ['required', 'string', 'regex:/^(0?[1-9]|1[0-2])$/'],
            'card_exp_year' => ['required', 'string', 'regex:/^\\d{2}(\\d{2})?$/'],
            'card_cvv' => ['required', 'string', 'regex:/^\\d{3,4}$/'],
            'installment' => ['nullable', 'integer', 'min:0', 'max:12'],
        ]);

        $order = $this->resolvePendingOrder($request, (int) $data['order_id']);

        $result = $this->paymentService->initializeVakifKatilim($order, $request, $data);

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

    private function resolvePendingOrder(Request $request, int $orderId): Order
    {
        $order = Order::query()
            ->with(['cart', 'items', 'addresses', 'taxLines', 'shipments'])
            ->findOrFail($orderId);

        $this->authorizeOrder($request, $order);
        abort_if($order->status !== 'pending_payment', 422, 'Siparis odeme icin uygun degil.');

        return $order;
    }
}
