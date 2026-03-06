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

class IyzicoCallbackController extends Controller
{
    public function __construct(private readonly PaymentService $paymentService) {}

    public function __invoke(Request $request): RedirectResponse
    {
        $token = (string) $request->input('token', '');
        $result = null;

        try {
            $result = $this->paymentService->handleCallback($request, $token);

            $status = $result['payment_status'] ?? 'failure';
            $orderId = $result['order_id'] ?? null;

            if ($orderId) {
                return $this->redirectToResult((int) $orderId, (string) $status);
            }

            return redirect()->to(route('storefront.checkout.index'));
        } catch (ValidationException $e) {
            Log::warning('Iyzico callback validation failed', [
                'errors' => $e->errors(),
                'token' => $token,
            ]);

            return redirect()->to(route('storefront.checkout.index'));
        } catch (\Throwable $e) {
            Log::error('Iyzico callback failed', [
                'result' => $result,
                'token' => $token,
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
            Log::warning('Iyzico signed result redirect failed, using access token fallback', [
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
