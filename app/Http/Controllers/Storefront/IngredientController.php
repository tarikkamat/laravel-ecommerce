<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Services\Contracts\IIngredientService;
use App\Settings\CatalogSettings;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IngredientController extends Controller
{
    public function __construct(
        private readonly IIngredientService $service,
        private readonly CatalogSettings $catalogSettings
    ) {}

    public function index(Request $request): Response
    {
        $perPage = (int) $request->integer('per_page', $this->catalogSettings->ingredients_per_page);

        return Inertia::render('storefront/ingredients/index', [
            'ingredients' => $this->service->paginate($perPage),
        ]);
    }

    public function show(string $identifier): Response
    {
        return Inertia::render('storefront/ingredients/show', [
            'ingredient' => $this->service->findBySlugOrIdOrFail($identifier),
        ]);
    }
}
