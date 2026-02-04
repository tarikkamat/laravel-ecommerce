<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Services\Contracts\IBrandService;
use App\Services\Contracts\ICategoryService;
use App\Settings\CatalogSettings;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function __construct(
        private readonly ICategoryService $service,
        private readonly IBrandService $brandService,
        private readonly CatalogSettings $catalogSettings
    ) {}

    public function index(Request $request): Response
    {
        $perPage = (int) $request->integer('per_page', $this->catalogSettings->categories_per_page);

        return Inertia::render('storefront/categories/index', [
            'categories' => $this->service->paginate($perPage),
        ]);
    }

    public function show(string $identifier): Response
    {
        return Inertia::render('storefront/categories/show', [
            'category' => $this->service->findBySlugOrIdOrFail($identifier),
        ]);
    }

    public function getProductsByCategorySlug(Request $request, string $identifier): Response
    {
        $perPage = (int) $request->integer('per_page', $this->catalogSettings->products_per_page);
        $sort = $request->string('sort')->toString();
        $brand = $request->string('brand')->toString();
        $brandsParam = $request->input('brands');
        $priceMin = $request->input('price_min');
        $priceMax = $request->input('price_max');
        $search = $request->string('search')->toString();
        $category = $this->service->findBySlugOrIdOrFail($identifier);

        $brands = [];

        if (is_array($brandsParam)) {
            $brands = array_values(array_filter($brandsParam, fn ($value) => $value !== null && $value !== ''));
        } elseif (is_string($brandsParam) && $brandsParam !== '') {
            $brands = array_values(array_filter(explode(',', $brandsParam), fn ($value) => $value !== ''));
        } elseif ($brand !== '') {
            $brands = [$brand];
        }

        $priceStats = $this->service->getPriceRangeByCategory($identifier);

        return Inertia::render('storefront/categories/products', [
            'category' => $category,
            'products' => $this->service->getProductsByCategorySlug(
                $identifier,
                $perPage,
                $sort,
                $brands,
                $search !== '' ? $search : null,
                is_numeric($priceMin) ? (float) $priceMin : null,
                is_numeric($priceMax) ? (float) $priceMax : null
            ),
            'sort' => $sort ?: 'default',
            'filters' => [
                'brands' => $brands,
                'price_min' => is_numeric($priceMin) ? (string) $priceMin : null,
                'price_max' => is_numeric($priceMax) ? (string) $priceMax : null,
                'search' => $search !== '' ? $search : null,
            ],
            'priceRange' => [
                'min' => $priceStats['min'] ?? 0,
                'max' => $priceStats['max'] ?? 0,
            ],
            'brands' => $this->brandService->all(['id', 'title', 'slug'])->toArray(),
        ]);
    }
}
