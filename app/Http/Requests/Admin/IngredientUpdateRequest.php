<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IngredientUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $ingredientId = $this->route('ingredient');

        return [
            'slug' => ['required', 'string', Rule::unique('ingredients', 'slug')->ignore($ingredientId)->whereNull('deleted_at')],
            'title' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'seo_title' => ['nullable', 'string'],
            'seo_description' => ['nullable', 'string'],
        ];
    }
}
