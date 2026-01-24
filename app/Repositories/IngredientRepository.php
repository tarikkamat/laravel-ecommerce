<?php

namespace App\Repositories;

use App\Models\Ingredient;
use App\Repositories\Contracts\IIngredientRepository;

class IngredientRepository extends BaseRepository implements IIngredientRepository
{
    public function __construct(Ingredient $model)
    {
        parent::__construct($model);
    }
}
