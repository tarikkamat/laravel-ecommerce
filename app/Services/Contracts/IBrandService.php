<?php

namespace App\Services\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface IBrandService extends IBaseService
{
    /**
     * Get products by brand slug or id with pagination.
     */
    public function getProductsByBrandSlug(
        string|int $identifier,
        int $perPage = 15,
        ?string $sort = null,
        array|string|null $category = null,
        ?string $search = null,
        ?float $priceMin = null,
        ?float $priceMax = null
    ): LengthAwarePaginator;

    /**
     * Get all brands with images for mega menu.
     */
    public function getBrandsForMegaMenu(): Collection;
}
