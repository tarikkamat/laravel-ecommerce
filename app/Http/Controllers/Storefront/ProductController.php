<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Services\Contracts\IProductService;
use App\Settings\CatalogSettings;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(
        private readonly IProductService $service,
        private readonly CatalogSettings $catalogSettings
    ) {}

    public function index(Request $request): Response
    {
        $perPage = (int) $request->integer('per_page', $this->catalogSettings->products_per_page);
        $sort = $request->string('sort')->toString();
        $category = $request->string('category')->toString();
        $categoriesParam = $request->input('categories');
        $priceMin = $request->input('price_min');
        $priceMax = $request->input('price_max');
        $search = $request->string('search')->toString();

        $query = Product::query()->with(['brand', 'images']);

        $categories = [];

        if (is_array($categoriesParam)) {
            $categories = array_values(array_filter($categoriesParam, fn ($value) => $value !== null && $value !== ''));
        } elseif (is_string($categoriesParam) && $categoriesParam !== '') {
            $categories = array_values(array_filter(explode(',', $categoriesParam), fn ($value) => $value !== ''));
        } elseif ($category !== '') {
            $categories = [$category];
        }

        if (count($categories) > 0) {
            $categoryIds = [];
            $categorySlugs = [];

            foreach ($categories as $value) {
                if (is_numeric($value)) {
                    $categoryIds[] = (int) $value;
                } elseif (is_string($value)) {
                    $categorySlugs[] = $value;
                }
            }

            $query->whereHas('categories', function ($builder) use ($categoryIds, $categorySlugs) {
                $builder->where(function ($inner) use ($categoryIds, $categorySlugs) {
                    if (count($categoryIds) > 0) {
                        $inner->whereIn('categories.id', $categoryIds);
                    }

                    if (count($categorySlugs) > 0) {
                        if (count($categoryIds) > 0) {
                            $inner->orWhereIn('categories.slug', $categorySlugs);
                        } else {
                            $inner->whereIn('categories.slug', $categorySlugs);
                        }
                    }
                });
            });
        }

        if (is_numeric($priceMin)) {
            $query->where('price', '>=', (float) $priceMin);
        }

        if (is_numeric($priceMax)) {
            $query->where('price', '<=', (float) $priceMax);
        }

        if ($search !== '') {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('brand', function ($inner) use ($search) {
                        $inner->where('title', 'like', "%{$search}%");
                    });
            });
        }

        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $priceStats = Product::query()
            ->selectRaw('MIN(price) as min_price, MAX(price) as max_price')
            ->first();

        return Inertia::render('storefront/products/index', [
            'products' => $query->paginate($perPage)->withQueryString(),
            'sort' => $sort ?: 'default',
            'filters' => [
                'categories' => $categories,
                'price_min' => is_numeric($priceMin) ? (string) $priceMin : null,
                'price_max' => is_numeric($priceMax) ? (string) $priceMax : null,
                'search' => $search !== '' ? $search : null,
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

    public function show(Request $request, string $identifier): Response
    {
        $product = $this->service->findBySlugOrIdOrFail($identifier);
        $product->load(['brand', 'categories', 'tags', 'ingredients', 'images']);

        if (! $request->header('x-inertia-prefetch')) {
            $product->increment('views_count');
        }

        return Inertia::render('storefront/products/show', [
            'product' => $product,
        ]);
    }
}
