<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ImageUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'slug' => ['required', 'string'],
            'path' => ['required_without:image_file', 'nullable', 'string'],
            'title' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'seo_title' => ['nullable', 'string'],
            'seo_description' => ['nullable', 'string'],
            'image_file' => ['required_without:path', 'nullable', 'image', 'mimes:png,jpg,jpeg,webp,svg', 'max:5120'],
        ];
    }
}
