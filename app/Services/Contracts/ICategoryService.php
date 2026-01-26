<?php

namespace App\Services\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface ICategoryService extends IBaseService
{
    public function getRootCategories(array $columns = ['*'], array $relations = []): Collection;

    /**
     * Get categories with nested children for mega menu (up to 3 levels).
     */
    public function getCategoriesForMegaMenu(): Collection;
}
