<?php

namespace App\Services\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface ICategoryService extends IBaseService
{
    public function getRootCategories(array $columns = ['*']): Collection;
}
