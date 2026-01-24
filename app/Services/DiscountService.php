<?php

namespace App\Services;

use App\Repositories\Contracts\IDiscountRepository;
use App\Services\Contracts\IDiscountService;

class DiscountService extends BaseService implements IDiscountService
{
    public function __construct(IDiscountRepository $repository)
    {
        parent::__construct($repository);
    }
}
