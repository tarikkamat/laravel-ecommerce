<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ingredient extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'slug',
        'title',
        'description',
        'seo_title',
        'seo_description',
    ];

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class);
    }
}
