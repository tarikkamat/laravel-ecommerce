<?php

namespace App\Services\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface ICategoryService extends IBaseService
{
    public function getRootCategories(array $columns = ['*'], array $relations = []): Collection;

    /**
     * Get categories with nested children for mega menu (up to 3 levels).
     */
    public function getCategoriesForMegaMenu(): Collection;

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
    ): LengthAwarePaginator;

    /**
     * Get price range (min/max) for products in a category.
     *
     * @return array{min: float, max: float}
     */
    public function getPriceRangeByCategory(string|int $identifier): array;
}
