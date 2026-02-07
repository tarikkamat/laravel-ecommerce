<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CartResolver;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function __construct(
        private readonly CartService $cartService,
        private readonly CartResolver $cartResolver
    ) {}

    public function index(Request $request): JsonResponse
    {
        return response()->json($this->cartService->summary($request));
    }

    public function storeItem(Request $request): JsonResponse
    {
        $data = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'qty' => ['nullable', 'integer', 'min:1'],
        ]);

        $summary = $this->cartService->addItem(
            $request,
            (int) $data['product_id'],
            (int) ($data['qty'] ?? 1),
        );

        return response()->json($summary);
    }

    public function updateItem(Request $request, int $itemId): JsonResponse
    {
        $data = $request->validate([
            'qty' => ['required', 'integer'],
        ]);

        $summary = $this->cartService->updateItem($request, $itemId, (int) $data['qty']);

        return response()->json($summary);
    }

    public function destroyItem(Request $request, int $itemId): JsonResponse
    {
        return response()->json($this->cartService->removeItem($request, $itemId));
    }

    public function clear(Request $request): JsonResponse
    {
        return response()->json($this->cartService->clear($request));
    }

    public function applyDiscount(Request $request): JsonResponse
    {
        $data = $request->validate([
            'code' => ['required', 'string'],
        ]);

        return response()->json($this->cartService->applyDiscount($request, (string) $data['code']));
    }

    public function removeDiscount(Request $request): JsonResponse
    {
        return response()->json($this->cartService->removeDiscount($request));
    }

    public function merge(Request $request): JsonResponse
    {
        $this->cartResolver->mergeGuestCartToUser($request);

        return response()->json($this->cartService->summary($request));
    }
}
