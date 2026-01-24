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
            ->getRootCategories(['id', 'title', 'slug'])
            ->map(fn ($category) => [
                'id' => $category->id,
                'name' => $category->title,
                'slug' => $category->slug,
                'image' => null,
            ]);

        return response()->json($categories);
    }

    public function featuredProducts(): JsonResponse
    {
        $paginator = $this->productService
            ->paginate(3, ['id', 'title', 'slug', 'price', 'sale_price', 'description'], ['images']);
        $products = collect($paginator->items())
            ->map(fn ($product) => [
                'id' => $product->id,
                'name' => $product->title,
                'slug' => $product->slug,
                'price' => $product->sale_price ?? $product->price,
                'description' => $product->description,
                'image' => $product->images->first()?->path
                    ? '/storage/' . $product->images->first()->path
                    : null,
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
}
