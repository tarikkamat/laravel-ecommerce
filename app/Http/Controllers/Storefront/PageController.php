<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function show(Request $request, string $slug): Response
    {
        $page = Page::query()
            ->where('slug', $slug)
            ->where('active', true)
            ->firstOrFail();

        return Inertia::render('storefront/pages/show', [
            'page' => [
                'id' => $page->id,
                'title' => $page->title,
                'slug' => $page->slug,
                'type' => $page->type->value,
                'content' => $page->content,
                'contact_email' => $page->contact_email,
                'contact_phone' => $page->contact_phone,
                'contact_address' => $page->contact_address,
            ],
        ]);
    }
}
