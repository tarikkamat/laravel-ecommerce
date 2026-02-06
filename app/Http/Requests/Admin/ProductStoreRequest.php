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
            'skt' => ['nullable', 'string', 'max:255', 'regex:/^\d{2}-\d{2}-\d{4}$/'],
            'active' => ['boolean'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['integer', 'exists:categories,id'],
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
            'ingredient_ids' => ['nullable', 'array'],
            'ingredient_ids.*' => ['integer', 'exists:ingredients,id'],
            // Image file uploads
            'image_files' => ['nullable', 'array'],
            'image_files.*' => ['image', 'mimes:png,jpg,jpeg,webp', 'max:5120'],
            'image_titles' => ['nullable', 'array'],
            'image_titles.*' => ['nullable', 'string'],
            'image_slugs' => ['nullable', 'array'],
            'image_slugs.*' => ['nullable', 'string'],
            'image_descriptions' => ['nullable', 'array'],
            'image_descriptions.*' => ['nullable', 'string'],
            'image_seo_titles' => ['nullable', 'array'],
            'image_seo_titles.*' => ['nullable', 'string'],
            'image_seo_descriptions' => ['nullable', 'array'],
            'image_seo_descriptions.*' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'image_files.*.image' => 'Dosya geçerli bir resim olmalıdır.',
            'image_files.*.mimes' => 'Resim sadece PNG, JPG, JPEG veya WebP formatında olabilir.',
            'image_files.*.max' => 'Resim en fazla 5MB olabilir.',
        ];
    }
}
