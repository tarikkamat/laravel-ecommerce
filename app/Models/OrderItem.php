<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'product_id',
        'qty',
        'unit_price',
        'unit_sale_price',
        'line_subtotal',
        'line_tax_total',
        'line_total',
        'title_snapshot',
        'sku_snapshot',
    ];

    protected function casts(): array
    {
        return [
            'qty' => 'integer',
            'unit_price' => 'decimal:2',
            'unit_sale_price' => 'decimal:2',
            'line_subtotal' => 'decimal:2',
            'line_tax_total' => 'decimal:2',
            'line_total' => 'decimal:2',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function taxLines(): HasMany
    {
        return $this->hasMany(OrderTaxLine::class);
    }
}
