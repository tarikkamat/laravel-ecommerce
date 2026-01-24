<?php

namespace App\Models;

use App\Enums\DiscountType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Discount extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'type',
        'value',
        'code',
        'usage_limit',
        'starts_at',
        'ends_at',
    ];

    protected function casts(): array
    {
        return [
            'type' => DiscountType::class,
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
        ];
    }
}
