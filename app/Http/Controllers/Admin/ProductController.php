<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductStoreRequest;
use App\Http\Requests\Admin\ProductUpdateRequest;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Image;
use App\Models\Ingredient;
use App\Models\Product;
use App\Models\Tag;
use App\Services\Contracts\IProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function __construct(private readonly IProductService $service) {}

    public function index(Request $request)
    {
        $perPage = (int) $request->integer('per_page', 15);

        return Inertia::render('admin/products/index', [
            'items' => $this->service->paginate($perPage),
            'options' => $this->options(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/products/create');
    }

    public function store(ProductStoreRequest $request)
    {
        $data = $request->validated();
        $categoryIds = $data['category_ids'] ?? null;
        $tagIds = $data['tag_ids'] ?? null;
        $ingredientIds = $data['ingredient_ids'] ?? null;
        $imageIds = $data['image_ids'] ?? null;
        unset($data['category_ids'], $data['tag_ids'], $data['ingredient_ids'], $data['image_ids']);

        /** @var Product $product */
        $product = $this->service->create($data);
        $this->syncMany($product, 'categories', $categoryIds);
        $this->syncMany($product, 'tags', $tagIds);
        $this->syncMany($product, 'ingredients', $ingredientIds);
        $this->syncMany($product, 'images', $imageIds);

        return redirect()->route('admin.products.index');
    }

    public function show(int $id)
    {
        $product = $this->service->findOrFail($id);

        $product->setAttribute(
            'category_ids',
            $product->categories()->pluck('categories.id')->values()->all()
        );
        $product->setAttribute(
            'tag_ids',
            $product->tags()->pluck('tags.id')->values()->all()
        );
        $product->setAttribute(
            'ingredient_ids',
            $product->ingredients()->pluck('ingredients.id')->values()->all()
        );
        $product->setAttribute(
            'image_ids',
            $product->images()->pluck('images.id')->values()->all()
        );

        return Inertia::render('admin/products/show', [
            'item' => $product,
            'options' => $this->options(),
        ]);
    }

    public function update(ProductUpdateRequest $request, int $id)
    {
        $data = $request->validated();
        $categoryIds = $data['category_ids'] ?? null;
        $tagIds = $data['tag_ids'] ?? null;
        $ingredientIds = $data['ingredient_ids'] ?? null;
        $imageIds = $data['image_ids'] ?? null;
        unset($data['category_ids'], $data['tag_ids'], $data['ingredient_ids'], $data['image_ids']);

        /** @var Product $product */
        $product = $this->service->update($id, $data);
        $this->syncMany($product, 'categories', $categoryIds);
        $this->syncMany($product, 'tags', $tagIds);
        $this->syncMany($product, 'ingredients', $ingredientIds);
        $this->syncMany($product, 'images', $imageIds);

        return redirect()->route('admin.products.index');
    }

    public function destroy(int $id)
    {
        $this->service->delete($id);

        return redirect()->route('admin.products.index');
    }

    private function options(): array
    {
        return [
            'brands' => Brand::query()
                ->select(['id', 'title'])
                ->orderBy('title')
                ->get()
                ->map(fn (Brand $brand): array => [
                    'value' => $brand->id,
                    'label' => $brand->title,
                ])
                ->values()
                ->all(),
            'categories' => Category::query()
                ->select(['id', 'title'])
                ->orderBy('title')
                ->get()
                ->map(fn (Category $category): array => [
                    'value' => $category->id,
                    'label' => $category->title,
                ])
                ->values()
                ->all(),
            'tags' => Tag::query()
                ->select(['id', 'title'])
                ->orderBy('title')
                ->get()
                ->map(fn (Tag $tag): array => [
                    'value' => $tag->id,
                    'label' => $tag->title,
                ])
                ->values()
                ->all(),
            'ingredients' => Ingredient::query()
                ->select(['id', 'title'])
                ->orderBy('title')
                ->get()
                ->map(fn (Ingredient $ingredient): array => [
                    'value' => $ingredient->id,
                    'label' => $ingredient->title,
                ])
                ->values()
                ->all(),
            'images' => Image::query()
                ->select(['id', 'title', 'path'])
                ->orderBy('id')
                ->get()
                ->map(fn (Image $image): array => [
                    'value' => $image->id,
                    'label' => $image->title ?: $image->path,
                ])
                ->values()
                ->all(),
        ];
    }

    private function syncMany(Product $product, string $relation, mixed $ids): void
    {
        if (! is_array($ids)) {
            return;
        }

        $ids = collect($ids)
            ->map(static fn (string $value): int => (int) trim($value))
            ->filter(static fn (int $id): bool => $id > 0)
            ->values()
            ->all();

        $product->{$relation}()->sync($ids);
    }
}
