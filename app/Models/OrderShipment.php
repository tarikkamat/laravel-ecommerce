<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderShipment extends Model
{
    protected $fillable = [
        'order_id',
        'provider',
        'service_code',
        'service_name',
        'shipping_total',
        'shipment_status',
        'tracking_number',
        'shipment_payload',
    ];

    protected function casts(): array
    {
        return [
            'shipping_total' => 'decimal:2',
            'shipment_payload' => 'array',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
