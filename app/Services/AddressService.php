<?php

namespace App\Services;

use App\Repositories\Contracts\IAddressRepository;
use App\Services\Contracts\IAddressService;

class AddressService extends BaseService implements IAddressService
{
    public function __construct(IAddressRepository $repository)
    {
        parent::__construct($repository);
    }
}
