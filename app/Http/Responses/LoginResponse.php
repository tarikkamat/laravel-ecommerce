<?php

namespace App\Http\Responses;

use App\Enums\Role;
use App\Services\CartResolver;
use Illuminate\Http\RedirectResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request): RedirectResponse
    {
        $user = $request->user();

        app(CartResolver::class)->mergeGuestCartToUser($request);

        if ($user?->role === Role::CUSTOMER) {
            return redirect()->intended(route('storefront.accounts.index'));
        }

        return redirect()->intended(route('admin.dashboard.index'));
    }
}
