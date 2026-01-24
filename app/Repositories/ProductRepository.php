<?php

namespace App\Repositories;

use App\Models\Product;
use App\Repositories\Contracts\IProductRepository;

class ProductRepository extends BaseRepository implements IProductRepository
{
    public function __construct(Product $model)
    {
        parent::__construct($model);
    }
}
