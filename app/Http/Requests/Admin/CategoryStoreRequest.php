<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoryStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'parent_id' => ['nullable', 'integer', 'exists:categories,id'],
            'slug' => ['required', 'string', Rule::unique('categories', 'slug')->whereNull('deleted_at')],
            'title' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'seo_title' => ['nullable', 'string'],
            'seo_description' => ['nullable', 'string'],
            'image_file' => ['nullable', 'image', 'max:5120'],
            'image_title' => ['nullable', 'string'],
            'image_slug' => ['nullable', 'string'],
            'image_description' => ['nullable', 'string'],
            'image_seo_title' => ['nullable', 'string'],
            'image_seo_description' => ['nullable', 'string'],
        ];
    }
}
