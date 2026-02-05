<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SettingsUpdateRequest;
use App\Models\Category;
use App\Settings\CatalogSettings;
use App\Settings\HomeSettings;
use App\Settings\NavigationSettings;
use App\Settings\PaymentSettings;
use App\Settings\ShippingSettings;
use App\Settings\SiteSettings;
use App\Settings\TaxSettings;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function edit(
        SiteSettings $siteSettings,
        NavigationSettings $navigationSettings,
        TaxSettings $taxSettings,
        PaymentSettings $paymentSettings,
        ShippingSettings $shippingSettings,
        HomeSettings $homeSettings,
        CatalogSettings $catalogSettings,
    ) {
        $categories = Category::query()
            ->select(['id', 'title'])
            ->orderBy('title')
            ->get();

        return Inertia::render('admin/settings/index', [
            'settings' => [
                'site' => [
                    'site_title' => $siteSettings->site_title,
                    'meta_description' => $siteSettings->meta_description,
                    'meta_keywords' => $siteSettings->meta_keywords,
                    'header_logo_path' => $siteSettings->header_logo_path,
                    'header_logo_text' => $siteSettings->header_logo_text,
                    'header_logo_tagline' => $siteSettings->header_logo_tagline,
                    'footer_logo_path' => $siteSettings->footer_logo_path,
                    'footer_logo_text' => $siteSettings->footer_logo_text,
                    'footer_description' => $siteSettings->footer_description,
                    'footer_copyright' => $siteSettings->footer_copyright,
                    'seller_name' => $siteSettings->seller_name,
                    'seller_address' => $siteSettings->seller_address,
                    'seller_phone' => $siteSettings->seller_phone,
                    'seller_email' => $siteSettings->seller_email,
                    'whatsapp_enabled' => $siteSettings->whatsapp_enabled,
                    'whatsapp_phone' => $siteSettings->whatsapp_phone,
                    'whatsapp_message' => $siteSettings->whatsapp_message,
                    'announcement_enabled' => $siteSettings->announcement_enabled,
                    'announcement_text' => $siteSettings->announcement_text,
                    'announcement_speed_seconds' => $siteSettings->announcement_speed_seconds,
                    'announcement_background' => $siteSettings->announcement_background,
                    'announcement_text_color' => $siteSettings->announcement_text_color,
                    'footer_bottom_links' => $siteSettings->footer_bottom_links,
                    'footer_socials' => $siteSettings->footer_socials,
                    'footer_menus' => $siteSettings->footer_menus,
                ],
                'navigation' => [
                    'header_menu' => $navigationSettings->header_menu,
                    'show_home_link' => $navigationSettings->show_home_link,
                    'show_brands_menu' => $navigationSettings->show_brands_menu,
                    'show_categories_menu' => $navigationSettings->show_categories_menu,
                ],
                'tax' => [
                    'default_rate' => $taxSettings->default_rate,
                    'label' => $taxSettings->label,
                    'category_rates' => $taxSettings->category_rates,
                ],
                'payments' => [
                    'iyzico_enabled' => $paymentSettings->iyzico_enabled,
                    'iyzico_api_key' => $paymentSettings->iyzico_api_key,
                    'iyzico_secret_key' => $paymentSettings->iyzico_secret_key,
                    'iyzico_base_url' => $paymentSettings->iyzico_base_url,
                    'iyzico_callback_url' => $paymentSettings->iyzico_callback_url,
                    'iyzico_webhook_secret' => $paymentSettings->iyzico_webhook_secret,
                ],
                'shipping' => [
                    'free_shipping_enabled' => $shippingSettings->free_shipping_enabled,
                    'free_shipping_minimum' => $shippingSettings->free_shipping_minimum,
                    'geliver_enabled' => $shippingSettings->geliver_enabled,
                    'geliver_token' => $shippingSettings->geliver_token,
                    'geliver_sender_address_id' => $shippingSettings->geliver_sender_address_id,
                    'geliver_source_identifier' => $shippingSettings->geliver_source_identifier,
                    'geliver_webhook_verify' => $shippingSettings->geliver_webhook_verify,
                    'geliver_webhook_secret' => $shippingSettings->geliver_webhook_secret,
                    'geliver_default_city_code' => $shippingSettings->geliver_default_city_code,
                    'geliver_distance_unit' => $shippingSettings->geliver_distance_unit,
                    'geliver_mass_unit' => $shippingSettings->geliver_mass_unit,
                    'geliver_default_length' => $shippingSettings->geliver_default_length,
                    'geliver_default_width' => $shippingSettings->geliver_default_width,
                    'geliver_default_height' => $shippingSettings->geliver_default_height,
                    'geliver_default_weight' => $shippingSettings->geliver_default_weight,
                ],
                'home' => [
                    'brands_sort_by' => $homeSettings->brands_sort_by,
                    'brands_sort_direction' => $homeSettings->brands_sort_direction,
                    'product_grid_sort_by' => $homeSettings->product_grid_sort_by,
                    'product_grid_sort_direction' => $homeSettings->product_grid_sort_direction,
                    'hero_autoplay_ms' => $homeSettings->hero_autoplay_ms,
                    'hero_slides' => $homeSettings->hero_slides,
                ],
                'catalog' => [
                    'products_per_page' => $catalogSettings->products_per_page,
                    'brands_per_page' => $catalogSettings->brands_per_page,
                    'categories_per_page' => $catalogSettings->categories_per_page,
                    'tags_per_page' => $catalogSettings->tags_per_page,
                    'ingredients_per_page' => $catalogSettings->ingredients_per_page,
                ],
            ],
            'categories' => $categories,
        ]);
    }

    public function update(
        SettingsUpdateRequest $request,
        SiteSettings $siteSettings,
        NavigationSettings $navigationSettings,
        TaxSettings $taxSettings,
        PaymentSettings $paymentSettings,
        ShippingSettings $shippingSettings,
        HomeSettings $homeSettings,
        CatalogSettings $catalogSettings,
    ) {
        $siteSettings->site_title = $request->string('site_title')->toString();
        $siteSettings->meta_description = $request->string('meta_description', '')->toString();
        $siteSettings->meta_keywords = $request->string('meta_keywords', '')->toString();
        $siteSettings->header_logo_path = $request->string('header_logo_path', '')->toString();
        $siteSettings->header_logo_text = $request->string('header_logo_text', '')->toString();
        $siteSettings->header_logo_tagline = $request->string('header_logo_tagline', '')->toString();
        $siteSettings->footer_logo_path = $request->string('footer_logo_path', '')->toString();
        $siteSettings->footer_logo_text = $request->string('footer_logo_text', '')->toString();
        $siteSettings->footer_description = $request->string('footer_description', '')->toString();
        $siteSettings->footer_copyright = $request->string('footer_copyright', '')->toString();
        $siteSettings->seller_name = $request->string('seller_name', '')->toString();
        $siteSettings->seller_address = $request->string('seller_address', '')->toString();
        $siteSettings->seller_phone = $request->string('seller_phone', '')->toString();
        $siteSettings->seller_email = $request->string('seller_email', '')->toString();
        $siteSettings->whatsapp_enabled = $request->boolean('whatsapp_enabled');
        $siteSettings->whatsapp_phone = $request->string('whatsapp_phone', '')->toString();
        $siteSettings->whatsapp_message = $request->string('whatsapp_message', '')->toString();
        $siteSettings->announcement_enabled = $request->boolean('announcement_enabled');
        $siteSettings->announcement_text = $request->string('announcement_text', '')->toString();
        $siteSettings->announcement_speed_seconds = (int) $request->input('announcement_speed_seconds', $siteSettings->announcement_speed_seconds);
        $siteSettings->announcement_background = $request->string('announcement_background', $siteSettings->announcement_background)->toString();
        $siteSettings->announcement_text_color = $request->string('announcement_text_color', $siteSettings->announcement_text_color)->toString();
        $siteSettings->footer_bottom_links = $request->input('footer_bottom_links', []);
        $siteSettings->footer_socials = $request->input('footer_socials', []);
        $siteSettings->footer_menus = $request->input('footer_menus', []);
        $siteSettings->save();

        $navigationSettings->header_menu = $request->input('header_menu', []);
        $navigationSettings->show_home_link = $request->boolean('show_home_link');
        $navigationSettings->show_brands_menu = $request->boolean('show_brands_menu');
        $navigationSettings->show_categories_menu = $request->boolean('show_categories_menu');
        $navigationSettings->save();

        $taxSettings->default_rate = (float) $request->input('tax_default_rate', $taxSettings->default_rate);
        $taxSettings->label = $request->string('tax_label', $taxSettings->label)->toString();
        $taxSettings->category_rates = $request->input('tax_category_rates', []);
        $taxSettings->save();

        $paymentSettings->iyzico_enabled = $request->boolean('iyzico_enabled');
        $paymentSettings->iyzico_api_key = $request->string('iyzico_api_key', '')->toString();
        $paymentSettings->iyzico_secret_key = $request->string('iyzico_secret_key', '')->toString();
        $paymentSettings->iyzico_base_url = $request->string('iyzico_base_url', $paymentSettings->iyzico_base_url)->toString();
        $paymentSettings->iyzico_callback_url = $request->string('iyzico_callback_url', '')->toString();
        $paymentSettings->iyzico_webhook_secret = $request->string('iyzico_webhook_secret', '')->toString();
        $paymentSettings->save();

        $shippingSettings->free_shipping_enabled = $request->boolean('free_shipping_enabled');
        $shippingSettings->free_shipping_minimum = (float) $request->input('free_shipping_minimum', 0);
        $shippingSettings->geliver_enabled = $request->boolean('geliver_enabled');
        $shippingSettings->geliver_token = $request->string('geliver_token', '')->toString();
        $shippingSettings->geliver_sender_address_id = $request->string('geliver_sender_address_id', '')->toString();
        $shippingSettings->geliver_source_identifier = $request->string('geliver_source_identifier', '')->toString();
        $shippingSettings->geliver_webhook_verify = $request->boolean('geliver_webhook_verify');
        $shippingSettings->geliver_webhook_secret = $request->string('geliver_webhook_secret', '')->toString();
        $shippingSettings->geliver_default_city_code = $request->string('geliver_default_city_code', $shippingSettings->geliver_default_city_code)->toString();
        $shippingSettings->geliver_distance_unit = $request->string('geliver_distance_unit', $shippingSettings->geliver_distance_unit)->toString();
        $shippingSettings->geliver_mass_unit = $request->string('geliver_mass_unit', $shippingSettings->geliver_mass_unit)->toString();
        $shippingSettings->geliver_default_length = (float) $request->input('geliver_default_length', $shippingSettings->geliver_default_length);
        $shippingSettings->geliver_default_width = (float) $request->input('geliver_default_width', $shippingSettings->geliver_default_width);
        $shippingSettings->geliver_default_height = (float) $request->input('geliver_default_height', $shippingSettings->geliver_default_height);
        $shippingSettings->geliver_default_weight = (float) $request->input('geliver_default_weight', $shippingSettings->geliver_default_weight);
        $shippingSettings->save();

        $homeSettings->brands_sort_by = $request->string('home_brands_sort_by', $homeSettings->brands_sort_by)->toString();
        $homeSettings->brands_sort_direction = $request->string('home_brands_sort_direction', $homeSettings->brands_sort_direction)->toString();
        $homeSettings->product_grid_sort_by = $request->string('home_product_grid_sort_by', $homeSettings->product_grid_sort_by)->toString();
        $homeSettings->product_grid_sort_direction = $request->string('home_product_grid_sort_direction', $homeSettings->product_grid_sort_direction)->toString();
        $homeSettings->hero_autoplay_ms = (int) $request->input('home_hero_autoplay_ms', $homeSettings->hero_autoplay_ms);
        $homeSettings->hero_slides = $request->input('home_hero_slides', []);
        $homeSettings->save();

        $catalogSettings->products_per_page = (int) $request->input('products_per_page', $catalogSettings->products_per_page);
        $catalogSettings->brands_per_page = (int) $request->input('brands_per_page', $catalogSettings->brands_per_page);
        $catalogSettings->categories_per_page = (int) $request->input('categories_per_page', $catalogSettings->categories_per_page);
        $catalogSettings->tags_per_page = (int) $request->input('tags_per_page', $catalogSettings->tags_per_page);
        $catalogSettings->ingredients_per_page = (int) $request->input('ingredients_per_page', $catalogSettings->ingredients_per_page);
        $catalogSettings->save();

        return back()->with('success', 'Ayarlar güncellendi.');
    }
}
