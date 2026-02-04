<?php

namespace App\Http\Requests\Admin;

use App\Enums\PageType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PageUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $pageId = $this->route('page');

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('pages', 'slug')->ignore($pageId)->whereNull('deleted_at')],
            'type' => ['required', 'string', Rule::in(array_map(fn (PageType $type) => $type->value, PageType::cases()))],
            'content' => ['nullable', 'string'],
            'contact_email' => ['nullable', 'email'],
            'contact_phone' => ['nullable', 'string', 'max:50'],
            'contact_address' => ['nullable', 'string'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:255'],
            'active' => ['boolean'],
        ];
    }
}
