<?php

namespace App\Services;

use App\Repositories\Contracts\IUserRepository;
use App\Services\Contracts\IUserService;

class UserService extends BaseService implements IUserService
{
    public function __construct(IUserRepository $repository)
    {
        parent::__construct($repository);
    }
}
