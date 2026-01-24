<?php

namespace App\Repositories;

use App\Models\Address;
use App\Repositories\Contracts\IAddressRepository;

class AddressRepository extends BaseRepository implements IAddressRepository
{
    public function __construct(Address $model)
    {
        parent::__construct($model);
    }
}
