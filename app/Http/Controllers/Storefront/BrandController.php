<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Services\Contracts\IBrandService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    public function __construct(
        private readonly IBrandService $service
    ) {}

    public function index(Request $request): Response
    {
        $perPage = (int) $request->integer('per_page', 15);

        return Inertia::render('storefront/brands/index', [
            'brands' => $this->service->paginate($perPage),
        ]);
    }

    public function show(string $identifier): Response
    {
        return Inertia::render('storefront/brands/show', [
            'brand' => $this->service->findBySlugOrIdOrFail($identifier),
        ]);
    }

    public function getProductsByBrandSlug(Request $request, string $identifier): Response
    {
        $perPage = (int) $request->integer('per_page', 12);
        $sort = $request->string('sort')->toString();
        $category = $request->string('category')->toString();
        $categoriesParam = $request->input('categories');
        $priceMin = $request->input('price_min');
        $priceMax = $request->input('price_max');
        $brand = $this->service->findBySlugOrIdOrFail($identifier);

        $categories = [];

        if (is_array($categoriesParam)) {
            $categories = array_values(array_filter($categoriesParam, fn ($value) => $value !== null && $value !== ''));
        } elseif (is_string($categoriesParam) && $categoriesParam !== '') {
            $categories = array_values(array_filter(explode(',', $categoriesParam), fn ($value) => $value !== ''));
        } elseif ($category !== '') {
            $categories = [$category];
        }

        $priceStats = $brand->products()
            ->selectRaw('MIN(price) as min_price, MAX(price) as max_price')
            ->first();

        return Inertia::render('storefront/brands/products', [
            'brand' => $brand,
            'products' => $this->service->getProductsByBrandSlug(
                $identifier,
                $perPage,
                $sort,
                $categories,
                is_numeric($priceMin) ? (float) $priceMin : null,
                is_numeric($priceMax) ? (float) $priceMax : null
            ),
            'sort' => $sort ?: 'default',
            'filters' => [
                'categories' => $categories,
                'price_min' => is_numeric($priceMin) ? (string) $priceMin : null,
                'price_max' => is_numeric($priceMax) ? (string) $priceMax : null,
            ],
            'priceRange' => [
                'min' => $priceStats?->min_price !== null ? (float) $priceStats->min_price : 0,
                'max' => $priceStats?->max_price !== null ? (float) $priceStats->max_price : 0,
            ],
            'categories' => $this->buildCategoryTree(),
        ]);
    }

    private function buildCategoryTree(): array
    {
        $categories = Category::query()
            ->select(['id', 'parent_id', 'title', 'slug'])
            ->orderBy('title')
            ->get()
            ->toArray();

        return $this->buildTree($categories, null);
    }

    private function buildTree(array $categories, ?int $parentId): array
    {
        $tree = [];

        foreach ($categories as $category) {
            if ($category['parent_id'] === $parentId) {
                $children = $this->buildTree($categories, $category['id']);
                $tree[] = [
                    'id' => $category['id'],
                    'title' => $category['title'],
                    'slug' => $category['slug'],
                    'children' => $children,
                ];
            }
        }

        return $tree;
    }
}
