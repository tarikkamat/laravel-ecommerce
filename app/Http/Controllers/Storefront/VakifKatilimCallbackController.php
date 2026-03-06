<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Services\PaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class VakifKatilimCallbackController extends Controller
{
    public function __construct(private readonly PaymentService $paymentService) {}

    public function __invoke(Request $request, ?int $payment = null): RedirectResponse
    {
        $result = null;

        try {
            $result = $this->paymentService->handleVakifKatilimCallback($request, $payment);

            $status = $result['payment_status'] ?? 'failure';
            $orderId = $result['order_id'] ?? null;

            if ($orderId) {
                return $this->redirectToResult((int) $orderId, (string) $status);
            }

            return redirect()->to(route('storefront.checkout.index'));
        } catch (ValidationException $e) {
            Log::warning('Vakif Katilim callback validation failed', [
                'payment_id' => $payment,
                'errors' => $e->errors(),
            ]);

            return redirect()->to(route('storefront.checkout.index'));
        } catch (\Throwable $e) {
            Log::error('Vakif Katilim callback failed', [
                'payment_id' => $payment,
                'result' => $result,
                'message' => $e->getMessage(),
                'exception' => $e,
            ]);

            $orderId = (int) ($result['order_id'] ?? 0);
            if ($orderId > 0) {
                return $this->redirectToResult(
                    $orderId,
                    (string) ($result['payment_status'] ?? 'failure')
                );
            }

            return redirect()->to(route('storefront.checkout.index'));
        }
    }

    private function redirectToResult(int $orderId, string $status): RedirectResponse
    {
        Cache::put("checkout_result_{$orderId}", ['paymentStatus' => $status], now()->addMinutes(10));

        try {
            $url = URL::temporarySignedRoute(
                'storefront.checkout.result',
                now()->addMinutes(10),
                ['order' => $orderId]
            );

            return redirect()->to($url);
        } catch (\Throwable $e) {
            Log::warning('Vakif Katilim signed result redirect failed, using access token fallback', [
                'order_id' => $orderId,
                'message' => $e->getMessage(),
            ]);
        }

        $accessToken = Str::random(40);
        Cache::put("checkout_result_access_{$accessToken}", [
            'orderId' => $orderId,
            'paymentStatus' => $status,
        ], now()->addMinutes(10));

        return redirect()->to(route('storefront.checkout.result', [
            'order' => $orderId,
            'access' => $accessToken,
        ]));
    }
}
