<?php

namespace App\Repositories;

use App\Models\Category;
use App\Repositories\Contracts\ICategoryRepository;
use Illuminate\Database\Eloquent\Collection;

class CategoryRepository extends BaseRepository implements ICategoryRepository
{
    public function __construct(Category $model)
    {
        parent::__construct($model);
    }

    /**
     * Get root categories (categories without parent).
     */
    public function getRootCategories(array $columns = ['*'], array $relations = []): Collection
    {
        return $this->model->whereNull('parent_id')->with($relations)->get($columns);
    }

    /**
     * Get categories with nested children for mega menu (up to 3 levels).
     */
    public function getCategoriesForMegaMenu(): Collection
    {
        return $this->model
            ->whereNull('parent_id')
            ->with([
                'image:id,path',
                'children:id,parent_id,title,slug',
                'children.children:id,parent_id,title,slug',
            ])
            ->select(['id', 'title', 'slug', 'image_id'])
            ->get();
    }
}
