<?php

namespace App\Services;

use App\Repositories\Contracts\IIngredientRepository;
use App\Services\Contracts\IIngredientService;

class IngredientService extends BaseService implements IIngredientService
{
    public function __construct(IIngredientRepository $repository)
    {
        parent::__construct($repository);
    }
}
