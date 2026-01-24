<?php

namespace App\Http\Requests\Admin;

use App\Enums\Role;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string'],
            'email' => ['required', 'email', Rule::unique('users', 'email')->whereNull('deleted_at')],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'string', Rule::in(array_map(fn (Role $role) => $role->value, Role::cases()))],
        ];
    }
}
