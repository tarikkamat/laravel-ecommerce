<?php

namespace App\Services;

use App\Models\Category;
use App\Repositories\Contracts\ICategoryRepository;
use App\Services\Contracts\ICategoryService;
use Illuminate\Database\Eloquent\Collection;

class CategoryService extends BaseService implements ICategoryService
{
    public function __construct(ICategoryRepository $repository)
    {
        parent::__construct($repository);
    }

    public function getRootCategories(array $columns = ['*']): Collection
    {
        return Category::whereNull('parent_id')->get($columns);
    }
}
