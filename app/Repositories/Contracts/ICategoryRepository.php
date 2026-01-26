<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface ICategoryRepository extends IBaseRepository
{
    /**
     * Get root categories (categories without parent).
     */
    public function getRootCategories(array $columns = ['*'], array $relations = []): Collection;

    /**
     * Get categories with nested children for mega menu (up to 3 levels).
     */
    public function getCategoriesForMegaMenu(): Collection;
}
