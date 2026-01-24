<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TagStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string'],
            'slug' => ['required', 'string', Rule::unique('tags', 'slug')->whereNull('deleted_at')],
            'description' => ['nullable', 'string'],
            'seo_title' => ['nullable', 'string'],
            'seo_description' => ['nullable', 'string'],
        ];
    }
}
