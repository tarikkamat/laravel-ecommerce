<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Product;
use App\Services\Contracts\ICategoryService;
use App\Services\Contracts\IProductService;
use App\Settings\HomeSettings;
use Illuminate\Http\JsonResponse;

class ApiHomeController extends Controller
{
    public function __construct(
        private readonly ICategoryService $categoryService,
        private readonly IProductService $productService,
        private readonly HomeSettings $homeSettings
    ) {}

    public function categories(): JsonResponse
    {
        $categories = $this->categoryService
            ->getRootCategories(['id', 'title', 'slug', 'image_id'], ['image'])
            ->map(fn ($category) => [
                'id' => $category->id,
                'name' => $category->title,
                'slug' => $category->slug,
                'image' => $category->image?->path ? '/storage/' . $category->image->path : null,
            ]);

        return response()->json($categories);
    }

    public function featuredProducts(): JsonResponse
    {
        $orderBy = $this->normalizeSort($this->homeSettings->product_grid_sort_by, ['title', 'created_at']);
        $direction = $this->normalizeDirection($this->homeSettings->product_grid_sort_direction);

        $paginator = Product::query()
            ->select(['id', 'title', 'slug', 'price', 'sale_price', 'stock', 'brand_id'])
            ->with(['images', 'brand'])
            ->where('active', true)
            ->orderBy($orderBy, $direction)
            ->paginate(10);
        $products = collect($paginator->items())
            ->map(fn ($product) => [
                'id' => $product->id,
                'title' => $product->title,
                'slug' => $product->slug,
                'price' => $product->price,
                'sale_price' => $product->sale_price,
                'stock' => $product->stock,
                'brand' => $product->brand ? [
                    'id' => $product->brand->id,
                    'title' => $product->brand->title,
                ] : null,
                'images' => $product->images->map(fn ($image) => [
                    'path' => $image->path,
                ])->values()->toArray(),
            ])
            ->values();

        return response()->json($products);
    }

    public function brands(): JsonResponse
    {
        $orderBy = $this->normalizeSort($this->homeSettings->brands_sort_by, ['title', 'created_at']);
        $direction = $this->normalizeDirection($this->homeSettings->brands_sort_direction);

        $brands = Brand::query()
            ->select(['id', 'title', 'slug', 'image_id'])
            ->with(['image:id,path'])
            ->orderBy($orderBy, $direction)
            ->get()
            ->map(fn ($brand) => [
                'id' => $brand->id,
                'title' => $brand->title,
                'slug' => $brand->slug,
                'image' => $brand->image?->path ? ['path' => $brand->image->path] : null,
            ])
            ->values();

        return response()->json($brands);
    }

    public function brandProducts(int $brandId): JsonResponse
    {
        $orderBy = $this->normalizeSort($this->homeSettings->product_grid_sort_by, ['title', 'created_at']);
        $direction = $this->normalizeDirection($this->homeSettings->product_grid_sort_direction);

        $products = $this->productService
            ->getByBrandId(
                $brandId,
                10,
                ['id', 'title', 'slug', 'price', 'sale_price', 'stock', 'brand_id'],
                ['images', 'brand'],
                $orderBy,
                $direction
            );

        $mapped = $products->map(fn ($product) => [
            'id' => $product->id,
            'title' => $product->title,
            'slug' => $product->slug,
            'price' => $product->price,
            'sale_price' => $product->sale_price,
            'stock' => $product->stock,
            'brand' => $product->brand ? [
                'id' => $product->brand->id,
                'title' => $product->brand->title,
            ] : null,
            'images' => $product->images->map(fn ($image) => [
                'path' => $image->path,
            ])->values()->toArray(),
        ])->values();

        return response()->json($mapped);
    }

    /**
     * @param  array<int, string>  $allowed
     */
    private function normalizeSort(string $sortBy, array $allowed): string
    {
        return in_array($sortBy, $allowed, true) ? $sortBy : $allowed[0];
    }

    private function normalizeDirection(string $direction): string
    {
        return strtolower($direction) === 'asc' ? 'asc' : 'desc';
    }
}
