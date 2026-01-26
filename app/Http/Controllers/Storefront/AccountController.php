<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $addresses = $user->addresses()->get();

        return Inertia::render('storefront/accounts/index', [
            'user' => $user,
            'addresses' => $addresses,
        ]);
    }
}
