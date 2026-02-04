<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItem extends Model
{
    protected $fillable = [
        'cart_id',
        'product_id',
        'qty',
        'unit_price_snapshot',
        'unit_sale_price_snapshot',
        'title_snapshot',
        'sku_snapshot',
        'stock_snapshot',
    ];

    protected function casts(): array
    {
        return [
            'qty' => 'integer',
            'unit_price_snapshot' => 'decimal:2',
            'unit_sale_price_snapshot' => 'decimal:2',
            'stock_snapshot' => 'integer',
        ];
    }

    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
