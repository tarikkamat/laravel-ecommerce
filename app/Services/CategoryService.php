<?php

namespace App\Services;

use App\Repositories\Contracts\ICategoryRepository;
use App\Services\Contracts\ICategoryService;

class CategoryService extends BaseService implements ICategoryService
{
    public function __construct(ICategoryRepository $repository)
    {
        parent::__construct($repository);
    }
}
