<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'order_id',
        'provider',
        'status',
        'amount',
        'currency',
        'conversation_id',
        'transaction_id',
        'raw_request',
        'raw_response',
        'raw_webhook',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'raw_request' => 'array',
            'raw_response' => 'array',
            'raw_webhook' => 'array',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
