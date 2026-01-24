<?php

namespace App\Repositories;

use App\Models\Discount;
use App\Repositories\Contracts\IDiscountRepository;

class DiscountRepository extends BaseRepository implements IDiscountRepository
{
    public function __construct(Discount $model)
    {
        parent::__construct($model);
    }
}
