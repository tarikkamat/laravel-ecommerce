<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CheckoutService;
use App\Services\ShippingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    public function __construct(
        private readonly CheckoutService $checkoutService,
        private readonly ShippingService $shippingService
    ) {}

    public function summary(Request $request): JsonResponse
    {
        return response()->json($this->checkoutService->summary($request));
    }

    public function storeAddress(Request $request): JsonResponse
    {
        $data = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'country' => ['required', 'string', 'max:2'],
            'city' => ['required', 'string', 'max:100'],
            'district' => ['nullable', 'string', 'max:100'],
            'line1' => ['required', 'string', 'max:255'],
            'line2' => ['nullable', 'string', 'max:255'],
            'postal_code' => ['nullable', 'string', 'max:20'],
        ]);

        return response()->json($this->checkoutService->storeAddress($request, $data));
    }

    public function rates(Request $request): JsonResponse
    {
        if ($request->has('address')) {
            $address = $request->validate([
                'address.full_name' => ['required', 'string', 'max:255'],
                'address.phone' => ['nullable', 'string', 'max:50'],
                'address.email' => ['nullable', 'email', 'max:255'],
                'address.country' => ['required', 'string', 'max:2'],
                'address.city' => ['required', 'string', 'max:100'],
                'address.district' => ['nullable', 'string', 'max:100'],
                'address.line1' => ['required', 'string', 'max:255'],
                'address.line2' => ['nullable', 'string', 'max:255'],
                'address.postal_code' => ['nullable', 'string', 'max:20'],
            ]);

            $this->shippingService->storeAddress($request, $address['address']);
        }

        return response()->json($this->checkoutService->getRates($request));
    }

    public function selectShipping(Request $request): JsonResponse
    {
        $data = $request->validate([
            'service_code' => ['required', 'string', 'max:100'],
        ]);

        return response()->json(
            $this->checkoutService->selectShipping($request, (string) $data['service_code'])
        );
    }

    public function confirm(Request $request): JsonResponse
    {
        $order = $this->checkoutService->confirm($request);

        return response()->json([
            'order_id' => $order->id,
            'status' => $order->status,
            'totals' => [
                'subtotal' => (float) $order->subtotal,
                'tax_total' => (float) $order->tax_total,
                'shipping_total' => (float) $order->shipping_total,
                'grand_total' => (float) $order->grand_total,
                'currency' => $order->currency,
            ],
        ]);
    }
}
