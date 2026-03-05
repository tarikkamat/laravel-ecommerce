<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Services\PaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\URL;
use Illuminate\Validation\ValidationException;

class VakifKatilimCallbackController extends Controller
{
    public function __construct(private readonly PaymentService $paymentService) {}

    public function __invoke(Request $request, ?int $payment = null): RedirectResponse
    {
        try {
            $result = $this->paymentService->handleVakifKatilimCallback($request, $payment);

            $status = $result['payment_status'] ?? 'failure';
            $orderId = $result['order_id'] ?? null;

            if ($orderId) {
                Cache::put("checkout_result_{$orderId}", ['paymentStatus' => $status], now()->addMinutes(10));

                $url = URL::temporarySignedRoute(
                    'storefront.checkout.result',
                    now()->addMinutes(10),
                    ['order' => $orderId]
                );

                return redirect()->away($url);
            }

            return redirect()
                ->route('storefront.checkout.index')
                ->with('paymentStatus', $status)
                ->with('orderId', $result['order_id'] ?? null);
        } catch (ValidationException $e) {
            return redirect()
                ->route('storefront.checkout.index')
                ->withErrors($e->errors());
        }
    }
}
