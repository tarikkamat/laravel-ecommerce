<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Services\CartService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartPageController extends Controller
{
    public function __construct(private readonly CartService $cartService) {}

    public function __invoke(Request $request): Response
    {
        $summary = $this->cartService->summary($request);
        $cart = $summary['cart'];

        return Inertia::render('storefront/cart/index', [
            'cartId' => $cart->id,
            'itemsCount' => $summary['items_count'],
            'totals' => $summary['totals'],
            'discount' => $summary['discount'],
            'apiEndpoints' => [
                'summary' => route('api.cart.index'),
                'addItem' => route('api.cart.items.store'),
                'updateItem' => route('api.cart.items.update', ['itemId' => '__ITEM_ID__']),
                'removeItem' => route('api.cart.items.destroy', ['itemId' => '__ITEM_ID__']),
                'clear' => route('api.cart.clear'),
                'applyDiscount' => route('api.cart.discount.apply'),
                'removeDiscount' => route('api.cart.discount.remove'),
                'checkoutSummary' => route('api.checkout.summary'),
                'checkoutPage' => route('storefront.checkout.index'),
            ],
        ]);
    }
}
