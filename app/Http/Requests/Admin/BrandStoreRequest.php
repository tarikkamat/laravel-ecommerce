<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BrandStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string'],
            'slug' => ['required', 'string', Rule::unique('brands', 'slug')->whereNull('deleted_at')],
            'description' => ['nullable', 'string'],
            'seo_title' => ['nullable', 'string'],
            'seo_description' => ['nullable', 'string'],
            'logo_file' => ['required', 'image', 'mimes:png,jpg,jpeg,svg,webp', 'max:5120'],
            'image_title' => ['nullable', 'string'],
            'image_slug' => ['nullable', 'string'],
            'image_description' => ['nullable', 'string'],
            'image_seo_title' => ['nullable', 'string'],
            'image_seo_description' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => ':attribute gereklidir.',
            'slug.required' => ':attribute gereklidir.',
            'slug.unique' => ':attribute zaten kullanılıyor.',
            'logo_file.required' => ':attribute gereklidir.',
            'logo_file.image' => ':attribute geçerli bir resim dosyası olmalıdır.',
            'logo_file.mimes' => ':attribute sadece PNG, JPG, JPEG, SVG veya WebP formatında olabilir.',
            'logo_file.max' => ':attribute en fazla 5MB olabilir.',
        ];
    }

    public function attributes(): array
    {
        return [
            'title' => 'Marka adı',
            'slug' => 'URL adresi',
            'logo_file' => 'Logo',
            'description' => 'Açıklama',
            'seo_title' => 'SEO başlığı',
            'seo_description' => 'SEO açıklaması',
        ];
    }
}
