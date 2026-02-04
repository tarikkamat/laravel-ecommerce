<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface IProductRepository extends IBaseRepository
{
    /**
     * Get products by brand ID with limit.
     *
     * @param  array<string>  $columns
     * @param  array<string>  $relations
     */
    public function getByBrandId(
        int $brandId,
        int $limit = 10,
        array $columns = ['*'],
        array $relations = [],
        ?string $orderBy = null,
        string $direction = 'desc'
    ): Collection;
}
