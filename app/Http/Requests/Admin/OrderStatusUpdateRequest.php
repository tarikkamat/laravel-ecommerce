<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class OrderStatusUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'string', 'in:pending_payment,paid,failed,cancelled,refunded'],
            'reason' => ['nullable', 'string', 'max:500'],
        ];
    }
}
