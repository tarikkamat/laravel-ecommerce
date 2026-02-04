<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Services\Contracts\ITagService;
use App\Settings\CatalogSettings;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TagController extends Controller
{
    public function __construct(
        private readonly ITagService $service,
        private readonly CatalogSettings $catalogSettings
    ) {}

    public function index(Request $request): Response
    {
        $perPage = (int) $request->integer('per_page', $this->catalogSettings->tags_per_page);

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
