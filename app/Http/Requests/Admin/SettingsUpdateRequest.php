<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class SettingsUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'site_title' => ['required', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:255'],
            'meta_keywords' => ['nullable', 'string', 'max:255'],
            'header_logo_path' => ['nullable', 'string', 'max:255'],
            'header_logo_text' => ['nullable', 'string', 'max:255'],
            'header_logo_tagline' => ['nullable', 'string', 'max:255'],
            'footer_logo_path' => ['nullable', 'string', 'max:255'],
            'footer_logo_text' => ['nullable', 'string', 'max:255'],
            'footer_description' => ['nullable', 'string'],
            'footer_copyright' => ['nullable', 'string', 'max:255'],
            'seller_name' => ['nullable', 'string', 'max:255'],
            'seller_address' => ['nullable', 'string'],
            'seller_phone' => ['nullable', 'string', 'max:50'],
            'seller_email' => ['nullable', 'email', 'max:255'],
            'whatsapp_enabled' => ['boolean'],
            'whatsapp_phone' => ['nullable', 'string', 'max:25'],
            'whatsapp_message' => ['nullable', 'string', 'max:500'],
            'announcement_enabled' => ['boolean'],
            'announcement_text' => ['nullable', 'string', 'max:255'],
            'announcement_texts' => ['nullable', 'array'],
            'announcement_texts.*' => ['string', 'max:255'],
            'announcement_speed_seconds' => ['nullable', 'integer', 'min:6', 'max:60'],
            'announcement_background' => ['nullable', 'string', 'max:20'],
            'announcement_text_color' => ['nullable', 'string', 'max:20'],

            'header_menu' => ['nullable', 'array'],
            'header_menu.*.label' => ['required_with:header_menu', 'string', 'max:255'],
            'header_menu.*.url' => ['required_with:header_menu', 'string', 'max:255'],
            'show_home_link' => ['boolean'],
            'show_brands_menu' => ['boolean'],
            'show_categories_menu' => ['boolean'],

            'footer_bottom_links' => ['nullable', 'array'],
            'footer_bottom_links.*.label' => ['required_with:footer_bottom_links', 'string', 'max:255'],
            'footer_bottom_links.*.url' => ['required_with:footer_bottom_links', 'string', 'max:255'],

            'footer_socials' => ['nullable', 'array'],
            'footer_socials.*.label' => ['required_with:footer_socials', 'string', 'max:255'],
            'footer_socials.*.url' => ['required_with:footer_socials', 'string', 'max:255'],

            'footer_menus' => ['nullable', 'array'],
            'footer_menus.*.title' => ['required_with:footer_menus', 'string', 'max:255'],
            'footer_menus.*.items' => ['nullable', 'array'],
            'footer_menus.*.items.*.label' => ['required_with:footer_menus.*.items', 'string', 'max:255'],
            'footer_menus.*.items.*.url' => ['required_with:footer_menus.*.items', 'string', 'max:255'],

            'tax_default_rate' => ['nullable', 'numeric', 'min:0'],
            'tax_label' => ['nullable', 'string', 'max:50'],
            'tax_prices_include_tax' => ['boolean'],
            'tax_category_rates' => ['nullable', 'array'],
            'tax_category_rates.*.category_id' => ['required_with:tax_category_rates', 'integer', 'exists:categories,id'],
            'tax_category_rates.*.rate' => ['required_with:tax_category_rates', 'numeric', 'min:0'],

            'iyzico_enabled' => ['boolean'],
            'iyzico_api_key' => ['nullable', 'string', 'max:255'],
            'iyzico_secret_key' => ['nullable', 'string', 'max:255'],
            'iyzico_base_url' => ['nullable', 'string', 'max:255'],
            'iyzico_callback_url' => ['nullable', 'string', 'max:255'],
            'iyzico_webhook_secret' => ['nullable', 'string', 'max:255'],

            'free_shipping_enabled' => ['boolean'],
            'free_shipping_minimum' => ['nullable', 'numeric', 'min:0'],
            'flat_rate_label' => ['nullable', 'string', 'max:255'],
            'flat_rate' => ['nullable', 'numeric', 'min:0'],

            'geliver_enabled' => ['boolean'],
            'geliver_token' => ['nullable', 'string', 'max:255'],
            'geliver_sender_address_id' => ['nullable', 'string', 'max:255'],
            'geliver_source_identifier' => ['nullable', 'string', 'max:255'],
            'geliver_webhook_verify' => ['boolean'],
            'geliver_webhook_secret' => ['nullable', 'string', 'max:255'],
            'geliver_default_city_code' => ['nullable', 'string', 'max:10'],
            'geliver_distance_unit' => ['nullable', 'string', 'max:10'],
            'geliver_mass_unit' => ['nullable', 'string', 'max:10'],
            'geliver_default_length' => ['nullable', 'numeric', 'min:0'],
            'geliver_default_width' => ['nullable', 'numeric', 'min:0'],
            'geliver_default_height' => ['nullable', 'numeric', 'min:0'],
            'geliver_default_weight' => ['nullable', 'numeric', 'min:0'],

            'home_brands_sort_by' => ['nullable', 'string', 'max:50'],
            'home_brands_sort_direction' => ['nullable', 'string', 'max:4'],
            'home_product_grid_sort_by' => ['nullable', 'string', 'max:50'],
            'home_product_grid_sort_direction' => ['nullable', 'string', 'max:4'],
            'home_hero_autoplay_ms' => ['nullable', 'integer', 'min:1000', 'max:60000'],
            'home_hero_slides' => ['nullable', 'array'],
            'home_hero_slides.*.image_path' => ['required_with:home_hero_slides', 'string', 'max:2048'],
            'home_hero_slides.*.eyebrow' => ['nullable', 'string', 'max:255'],
            'home_hero_slides.*.title' => ['nullable', 'string', 'max:255'],
            'home_hero_slides.*.subtitle' => ['nullable', 'string'],
            'home_hero_slides.*.buttons' => ['nullable', 'array'],
            'home_hero_slides.*.buttons.*.label' => ['required_with:home_hero_slides.*.buttons', 'string', 'max:255'],
            'home_hero_slides.*.buttons.*.url' => ['required_with:home_hero_slides.*.buttons', 'string', 'max:255'],
            'home_hero_slides.*.buttons.*.variant' => ['nullable', 'in:primary,secondary'],

            'products_per_page' => ['nullable', 'integer', 'min:1', 'max:200'],
            'brands_per_page' => ['nullable', 'integer', 'min:1', 'max:200'],
            'categories_per_page' => ['nullable', 'integer', 'min:1', 'max:200'],
            'tags_per_page' => ['nullable', 'integer', 'min:1', 'max:200'],
            'ingredients_per_page' => ['nullable', 'integer', 'min:1', 'max:200'],
        ];
    }
}
