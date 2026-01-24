<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Brand extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'image_id',
        'title',
        'description',
        'seo_title',
        'seo_description',
        'slug',
    ];

    protected $with = ['image'];

    public function image(): BelongsTo
    {
        return $this->belongsTo(Image::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
