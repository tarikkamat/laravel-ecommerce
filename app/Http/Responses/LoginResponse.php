<?php

namespace App\Http\Responses;

use App\Enums\Role;
use Illuminate\Http\RedirectResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request): RedirectResponse
    {
        $user = $request->user();

        if ($user?->role === Role::CUSTOMER) {
            return redirect()->intended(route('account'));
        }

        return redirect()->intended(config('fortify.home'));
    }
}
