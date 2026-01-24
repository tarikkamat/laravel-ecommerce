<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Image extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'slug',
        'path',
        'title',
        'description',
        'seo_title',
        'seo_description',
    ];
}
