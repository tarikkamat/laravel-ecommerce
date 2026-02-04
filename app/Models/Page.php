<?php

namespace App\Models;

use App\Enums\PageType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Page extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'type',
        'content',
        'contact_email',
        'contact_phone',
        'contact_address',
        'seo_title',
        'seo_description',
        'active',
    ];

    protected function casts(): array
    {
        return [
            'type' => PageType::class,
            'active' => 'boolean',
        ];
    }
}
