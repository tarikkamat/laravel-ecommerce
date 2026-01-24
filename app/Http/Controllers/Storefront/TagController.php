<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Services\Contracts\ITagService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TagController extends Controller
{
    public function __construct(private readonly ITagService $service) {}

    public function index(Request $request): Response
    {
        $perPage = (int) $request->integer('per_page', 15);

        return Inertia::render('storefront/tags/index', [
            'tags' => $this->service->paginate($perPage),
        ]);
    }

    public function show(string $identifier): Response
    {
        return Inertia::render('storefront/tags/show', [
            'tag' => $this->service->findBySlugOrIdOrFail($identifier),
        ]);
    }
}
