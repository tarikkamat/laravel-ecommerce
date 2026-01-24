<?php

namespace App\Repositories;

use App\Models\Brand;
use App\Repositories\Contracts\IBrandRepository;

class BrandRepository extends BaseRepository implements IBrandRepository
{
    public function __construct(Brand $model)
    {
        parent::__construct($model);
    }
}
