<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Contracts\IUserRepository;

class UserRepository extends BaseRepository implements IUserRepository
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }
}
