<?php

namespace App\Repositories;

use App\Models\Brand;
use App\Repositories\Contracts\IBrandRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class BrandRepository extends BaseRepository implements IBrandRepository
{
    public function __construct(Brand $model)
    {
        parent::__construct($model);
    }

    /**
     * Get products by brand slug or id with pagination.
     */
    public function getProductsByBrandSlug(
        string|int $identifier,
        int $perPage = 15,
        ?string $sort = null,
        array|string|null $category = null,
        ?float $priceMin = null,
        ?float $priceMax = null
    ): LengthAwarePaginator
    {
        $brand = $this->findBySlugOrIdOrFail($identifier);

        $query = $brand->products()
            ->with(['images', 'brand', 'categories', 'tags'])
            ->where('active', true);

        if ($category !== null && $category !== '') {
            $categories = [];

            if (is_array($category)) {
                $categories = array_values(array_filter($category, fn ($value) => $value !== null && $value !== ''));
            } elseif (is_string($category)) {
                $categories = array_values(array_filter(explode(',', $category), fn ($value) => $value !== ''));
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
}
