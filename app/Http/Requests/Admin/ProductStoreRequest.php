<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'brand_id' => ['required', 'integer', 'exists:brands,id'],
            'slug' => ['required', 'string', Rule::unique('products', 'slug')->whereNull('deleted_at')],
            'title' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'seo_title' => ['nullable', 'string'],
            'seo_description' => ['nullable', 'string'],
            'sku' => ['required', 'string', Rule::unique('products', 'sku')->whereNull('deleted_at')],
            'price' => ['required', 'numeric', 'min:0'],
            'sale_price' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'barcode' => ['nullable', 'string', Rule::unique('products', 'barcode')->whereNull('deleted_at')],
            'active' => ['boolean'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['integer', 'exists:categories,id'],
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
            'ingredient_ids' => ['nullable', 'array'],
            'ingredient_ids.*' => ['integer', 'exists:ingredients,id'],
            'image_ids' => ['nullable', 'array'],
            'image_ids.*' => ['integer', 'exists:images,id'],
        ];
    }
}
