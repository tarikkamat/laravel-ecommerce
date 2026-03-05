<?php

namespace App\Http\Controllers\Storefront;

use App\Enums\PageType;
use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Services\CheckoutService;
use App\Settings\PaymentSettings;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutPageController extends Controller
{
    public function __construct(
        private readonly CheckoutService $checkoutService,
        private readonly PaymentSettings $paymentSettings,
    ) {}

    public function __invoke(Request $request): Response
    {
        $summary = $this->checkoutService->summary($request);
        $contractPage = Page::query()
            ->where('type', PageType::CONTRACT->value)
            ->where('active', true)
            ->where('slug', 'mesafeli-satis-sozlesmesi')
            ->latest('id')
            ->first();

        $paymentMethods = [];
        if ($this->paymentSettings->iyzico_enabled) {
            $paymentMethods[] = [
                'code' => 'iyzico',
                'label' => 'Iyzico',
            ];
        }

        if ($this->paymentSettings->vakif_katilim_enabled) {
            $paymentMethods[] = [
                'code' => 'vakif_katilim',
                'label' => 'Vakif Katilim',
            ];
        }

        return Inertia::render('storefront/checkout/index', [
            'itemsCount' => $summary['items_count'],
            'address' => $summary['address'],
            'billingAddress' => $summary['billing_address'],
            'selectedShipping' => $summary['selected_shipping'],
            'totals' => $summary['totals'],
            'paymentMethods' => $paymentMethods,
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
                'initializeIyzicoPayment' => route('api.payments.iyzico.initialize'),
                'initializeVakifKatilimPayment' => route('api.payments.vakif.initialize'),
                'cartPage' => route('storefront.cart.index'),
            ],
        ]);
    }
}
