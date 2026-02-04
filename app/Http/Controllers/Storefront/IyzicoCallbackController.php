<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Services\PaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\URL;
use Illuminate\Validation\ValidationException;

class IyzicoCallbackController extends Controller
{
    public function __construct(private readonly PaymentService $paymentService) {}

    public function __invoke(Request $request): RedirectResponse
    {
        $token = (string) $request->input('token', '');

        try {
            $result = $this->paymentService->handleCallback($request, $token);

            $status = $result['payment_status'] ?? 'failure';
            $orderId = $result['order_id'] ?? null;

            if ($orderId) {
                // Store payment result in cache (not session) so we don't overwrite the user's auth.
                // Callback is often cross-site POST; writing session would create a new session cookie.
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
