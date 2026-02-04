<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ImageStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'slug' => ['required_without_all:image_file,image_files', 'nullable', 'string'],
            'path' => ['required_without_all:image_file,image_files', 'nullable', 'string'],
            'title' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'seo_title' => ['nullable', 'string'],
            'seo_description' => ['nullable', 'string'],
            'image_file' => ['required_without_all:path,image_files', 'nullable', 'image', 'mimes:png,jpg,jpeg,webp,svg', 'max:5120'],
            'image_files' => ['required_without_all:path,image_file', 'nullable', 'array'],
            'image_files.*' => ['image', 'mimes:png,jpg,jpeg,webp,svg', 'max:5120'],
        ];
    }
}
