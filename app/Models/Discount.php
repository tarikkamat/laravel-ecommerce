<?php

namespace App\Models;

use App\Enums\DiscountType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

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

    public function isActive(?Carbon $now = null): bool
    {
        $at = $now ?? now();

        if ($this->starts_at && $this->starts_at->gt($at)) {
            return false;
        }

        if ($this->ends_at && $this->ends_at->lt($at)) {
            return false;
        }

        return true;
    }
}
