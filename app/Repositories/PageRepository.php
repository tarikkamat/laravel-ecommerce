<?php

namespace App\Repositories;

use App\Models\Page;
use App\Repositories\Contracts\IPageRepository;

class PageRepository extends BaseRepository implements IPageRepository
{
    public function __construct(Page $model)
    {
        parent::__construct($model);
    }
}
