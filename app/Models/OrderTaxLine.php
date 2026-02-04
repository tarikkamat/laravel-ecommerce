<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderTaxLine extends Model
{
    protected $fillable = [
        'order_id',
        'order_item_id',
        'scope',
        'name',
        'rate',
        'base_amount',
        'tax_amount',
    ];

    protected function casts(): array
    {
        return [
            'rate' => 'decimal:4',
            'base_amount' => 'decimal:2',
            'tax_amount' => 'decimal:2',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class);
    }
}
