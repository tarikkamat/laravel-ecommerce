<?php

namespace App\Repositories;

use App\Models\Category;
use App\Repositories\Contracts\ICategoryRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CategoryRepository extends BaseRepository implements ICategoryRepository
{
    public function __construct(Category $model)
    {
        parent::__construct($model);
    }

    /**
     * Get root categories (categories without parent).
     */
    public function getRootCategories(array $columns = ['*'], array $relations = []): Collection
    {
        return $this->model->whereNull('parent_id')->with($relations)->get($columns);
    }

    /**
     * Get categories with nested children for mega menu (up to 3 levels).
     */
    public function getCategoriesForMegaMenu(): Collection
    {
        return $this->model
            ->whereNull('parent_id')
            ->with([
                'image:id,path',
                'children:id,parent_id,title,slug',
                'children.children:id,parent_id,title,slug',
            ])
            ->select(['id', 'title', 'slug', 'image_id'])
            ->get();
    }

    /**
     * Get products by category slug or id with pagination.
     */
    public function getProductsByCategorySlug(
        string|int $identifier,
        int $perPage = 15,
        ?string $sort = null,
        array|string|null $brand = null,
        ?float $priceMin = null,
        ?float $priceMax = null
    ): LengthAwarePaginator {
        $category = $this->findBySlugOrIdOrFail($identifier);

        $query = $category->products()
            ->with(['images', 'brand', 'categories', 'tags'])
            ->where('active', true);

        if ($brand !== null && $brand !== '') {
            $brands = [];

            if (is_array($brand)) {
                $brands = array_values(array_filter($brand, fn ($value) => $value !== null && $value !== ''));
            } elseif (is_string($brand)) {
                $brands = array_values(array_filter(explode(',', $brand), fn ($value) => $value !== ''));
            }

            if (count($brands) > 0) {
                $brandIds = [];
                $brandSlugs = [];

                foreach ($brands as $value) {
                    if (is_numeric($value)) {
                        $brandIds[] = (int) $value;
                    } elseif (is_string($value)) {
                        $brandSlugs[] = $value;
                    }
                }

                $query->where(function ($builder) use ($brandIds, $brandSlugs) {
                    if (count($brandIds) > 0) {
                        $builder->whereIn('brand_id', $brandIds);
                    }

                    if (count($brandSlugs) > 0) {
                        $builder->orWhereHas('brand', function ($inner) use ($brandSlugs) {
                            $inner->whereIn('slug', $brandSlugs);
                        });
                    }
                });
            }
        }

        if ($priceMin !== null) {
            $query->where('price', '>=', $priceMin);
        }

        if ($priceMax !== null) {
            $query->where('price', '<=', $priceMax);
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

        return $query->paginate($perPage)->withQueryString();
    }

    /**
     * Get price range (min/max) for products in a category.
     *
     * @return array{min: float, max: float}
     */
    public function getPriceRangeByCategory(string|int $identifier): array
    {
        $category = $this->findBySlugOrIdOrFail($identifier);

        $priceStats = $category->products()
            ->where('active', true)
            ->selectRaw('MIN(price) as min_price, MAX(price) as max_price')
            ->first();

        return [
            'min' => $priceStats?->min_price !== null ? (float) $priceStats->min_price : 0,
            'max' => $priceStats?->max_price !== null ? (float) $priceStats->max_price : 0,
        ];
    }
}
