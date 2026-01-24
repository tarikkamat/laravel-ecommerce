<?php

namespace App\Repositories;

use App\Models\Tag;
use App\Repositories\Contracts\ITagRepository;

class TagRepository extends BaseRepository implements ITagRepository
{
    public function __construct(Tag $model)
    {
        parent::__construct($model);
    }
}
