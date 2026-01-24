<?php

namespace App\Http\Requests\Admin;

use App\Enums\DiscountType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DiscountUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $discountId = $this->route('discount');

        return [
            'title' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'type' => ['required', 'string', Rule::in(array_map(fn (DiscountType $type) => $type->value, DiscountType::cases()))],
            'value' => ['required', 'numeric', 'min:0'],
            'code' => ['nullable', 'string', Rule::unique('discounts', 'code')->ignore($discountId)->whereNull('deleted_at')],
            'usage_limit' => ['nullable', 'integer', 'min:0'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
        ];
    }
}
