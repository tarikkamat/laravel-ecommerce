<?php

namespace App\Services;

use App\Repositories\Contracts\ITagRepository;
use App\Services\Contracts\ITagService;

class TagService extends BaseService implements ITagService
{
    public function __construct(ITagRepository $repository)
    {
        parent::__construct($repository);
    }
}
