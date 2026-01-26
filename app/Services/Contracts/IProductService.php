<?php

namespace App\Services\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface IProductService extends IBaseService
{
    /**
     * Get products by brand ID with limit.
     *
     * @param  array<string>  $columns
     * @param  array<string>  $relations
     */
    public function getByBrandId(int $brandId, int $limit = 10, array $columns = ['*'], array $relations = []): Collection;
}
