<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Product;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $query = trim((string) $request->query('q', ''));

        if ($query === '' || mb_strlen($query) < 2) {
            return response()->json([
                'products' => [],
                'brands' => [],
            ]);
        }

        $products = Product::query()
            ->where('active', true)
            ->where(function ($builder) use ($query) {
                $builder
                    ->where('title', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%")
                    ->orWhereHas('brand', function ($inner) use ($query) {
                        $inner->where('title', 'like', "%{$query}%");
                    });
            })
            ->with(['brand:id,title,slug', 'images:id,path'])
            ->select(['id', 'title', 'slug', 'brand_id'])
            ->limit(6)
            ->get()
            ->map(function ($product) {
                $imagePath = $product->images->first()?->path;
                return [
                    'id' => $product->id,
                    'title' => $product->title,
                    'slug' => $product->slug,
                    'brand' => $product->brand?->title,
                    'image' => $imagePath ? "/storage/{$imagePath}" : null,
                ];
            });

        $brands = Brand::query()
            ->where('title', 'like', "%{$query}%")
            ->select(['id', 'title', 'slug'])
            ->limit(6)
            ->get();

        return response()->json([
            'products' => $products,
            'brands' => $brands,
        ]);
    }
}
