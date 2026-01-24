<?php

namespace App\Http\Requests\Admin;

use App\Enums\AddressType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AddressStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'type' => ['required', 'string', Rule::in(array_map(fn (AddressType $type) => $type->value, AddressType::cases()))],
            'address' => ['required', 'string'],
            'zip_code' => ['nullable', 'string'],
            'contact_name' => ['required', 'string'],
            'city' => ['required', 'string'],
            'country' => ['required', 'string'],
        ];
    }
}
