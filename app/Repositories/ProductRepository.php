<?php

namespace App\Repositories;

use App\Models\Product;
use App\Repositories\Contracts\IProductRepository;
use Illuminate\Database\Eloquent\Collection;

class ProductRepository extends BaseRepository implements IProductRepository
{
    public function __construct(Product $model)
    {
        parent::__construct($model);
    }

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
    ): Collection
    {
        $orderColumn = $orderBy ?: 'created_at';
        $orderDirection = strtolower($direction) === 'asc' ? 'asc' : 'desc';

        return $this->model
            ->select($columns)
            ->with($relations)
            ->where('brand_id', $brandId)
            ->where('active', true)
            ->orderBy($orderColumn, $orderDirection)
            ->limit($limit)
            ->get();
    }
}
