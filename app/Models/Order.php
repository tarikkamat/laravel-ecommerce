<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'cart_id',
        'status',
        'cancelled_at',
        'refunded_at',
        'cancel_reason',
        'refund_reason',
        'currency',
        'subtotal',
        'discount_total',
        'tax_total',
        'shipping_total',
        'grand_total',
    ];

    protected function casts(): array
    {
        return [
            'cancelled_at' => 'datetime',
            'refunded_at' => 'datetime',
            'subtotal' => 'decimal:2',
            'discount_total' => 'decimal:2',
            'tax_total' => 'decimal:2',
            'shipping_total' => 'decimal:2',
            'grand_total' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function addresses(): HasMany
    {
        return $this->hasMany(OrderAddress::class);
    }

    public function shipments(): HasMany
    {
        return $this->hasMany(OrderShipment::class);
    }

    public function taxLines(): HasMany
    {
        return $this->hasMany(OrderTaxLine::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
