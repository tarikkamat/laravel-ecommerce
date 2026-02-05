<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;
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

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'string', Rule::in(['billing', 'shipping'])],
            'contact_name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'country' => ['required', 'string', 'max:2'],
            'zip_code' => ['nullable', 'string', 'max:20'],
        ]);

        $request->user()->addresses()->create($validated);

        return redirect()->route('storefront.accounts.index')->with('success', 'Adres eklendi.');
    }
}
