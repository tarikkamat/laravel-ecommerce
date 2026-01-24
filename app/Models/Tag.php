<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tag extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'seo_title',
        'seo_description',
        'description',
    ];

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class);
    }
}
