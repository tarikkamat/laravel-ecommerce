<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderAddress extends Model
{
    protected $fillable = [
        'order_id',
        'type',
        'full_name',
        'phone',
        'country',
        'city',
        'district',
        'line1',
        'line2',
        'postal_code',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
