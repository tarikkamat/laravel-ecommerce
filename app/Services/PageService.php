<?php

namespace App\Services;

use App\Repositories\Contracts\IPageRepository;
use App\Services\Contracts\IPageService;

class PageService extends BaseService implements IPageService
{
    public function __construct(IPageRepository $repository)
    {
        parent::__construct($repository);
    }
}
