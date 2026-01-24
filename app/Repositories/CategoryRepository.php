<?php

namespace App\Repositories;

use App\Models\Category;
use App\Repositories\Contracts\ICategoryRepository;

class CategoryRepository extends BaseRepository implements ICategoryRepository
{
    public function __construct(Category $model)
    {
        parent::__construct($model);
    }
}
