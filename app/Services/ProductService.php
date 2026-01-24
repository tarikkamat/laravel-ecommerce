<?php

namespace App\Services;

use App\Repositories\Contracts\IProductRepository;
use App\Services\Contracts\IProductService;

class ProductService extends BaseService implements IProductService
{
    public function __construct(IProductRepository $repository)
    {
        parent::__construct($repository);
    }
}
