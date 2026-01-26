<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Contracts\IBrandService;
use App\Services\Contracts\ICategoryService;
use App\Services\Contracts\IProductService;
use Illuminate\Http\JsonResponse;

class ApiHomeController extends Controller
{
    public function __construct(
        private readonly ICategoryService $categoryService,
        private readonly IProductService $productService,
        private readonly IBrandService $brandService
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
        $paginator = $this->productService
            ->paginate(10, ['id', 'title', 'slug', 'price', 'sale_price', 'stock', 'brand_id'], ['images', 'brand']);
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
        $brands = $this->brandService
            ->all(['id', 'title', 'slug', 'image_id'])
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
        $products = $this->productService
            ->getByBrandId($brandId, 10, ['id', 'title', 'slug', 'price', 'sale_price', 'stock', 'brand_id'], ['images', 'brand']);

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
}
