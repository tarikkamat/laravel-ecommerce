<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Enums\PageType;
use App\Models\Page;
use App\Services\CheckoutService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutPageController extends Controller
{
    public function __construct(private readonly CheckoutService $checkoutService) {}

    public function __invoke(Request $request): Response
    {
        $summary = $this->checkoutService->summary($request);
        $contractPage = Page::query()
            ->where('type', PageType::CONTRACT->value)
            ->where('active', true)
            ->where('slug', 'mesafeli-satis-sozlesmesi')
            ->latest('id')
            ->first();

        return Inertia::render('storefront/checkout/index', [
            'itemsCount' => $summary['items_count'],
            'address' => $summary['address'],
            'billingAddress' => $summary['billing_address'],
            'selectedShipping' => $summary['selected_shipping'],
            'totals' => $summary['totals'],
            'contractPage' => $contractPage ? [
                'title' => $contractPage->title,
                'content' => $contractPage->content,
            ] : null,
            'apiEndpoints' => [
                'summary' => route('api.checkout.summary'),
                'address' => route('api.checkout.address'),
                'rates' => route('api.checkout.shipping.rates'),
                'selectShipping' => route('api.checkout.shipping.select'),
                'confirm' => route('api.checkout.confirm'),
                'initializePayment' => route('api.payments.iyzico.initialize'),
                'cartPage' => route('storefront.cart.index'),
            ],
        ]);
    }
}
