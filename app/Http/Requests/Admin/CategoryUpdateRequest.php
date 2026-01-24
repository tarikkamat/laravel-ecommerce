<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoryUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $categoryId = $this->route('category');

        return [
            'parent_id' => ['nullable', 'integer', 'exists:categories,id'],
            'slug' => ['required', 'string', Rule::unique('categories', 'slug')->ignore($categoryId)->whereNull('deleted_at')],
            'title' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'seo_title' => ['nullable', 'string'],
            'seo_description' => ['nullable', 'string'],
        ];
    }
}
