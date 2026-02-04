<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->addIfMissing('site.site_title', 'SUUG');
        $this->addIfMissing('site.meta_description', '');
        $this->addIfMissing('site.meta_keywords', '');
        $this->addIfMissing('site.header_logo_path', '');
        $this->addIfMissing('site.header_logo_text', 'SUUG');
        $this->addIfMissing('site.header_logo_tagline', 'BEAUTY');
        $this->addIfMissing('site.footer_logo_path', '');
        $this->addIfMissing('site.footer_logo_text', 'SUUG');
        $this->addIfMissing('site.footer_description', '');
        $this->addIfMissing('site.footer_copyright', '');
        $this->addIfMissing('site.seller_name', '');
        $this->addIfMissing('site.seller_address', '');
        $this->addIfMissing('site.seller_phone', '');
        $this->addIfMissing('site.seller_email', '');
        $this->addIfMissing('site.footer_bottom_links', []);
        $this->addIfMissing('site.footer_socials', []);
        $this->addIfMissing('site.footer_menus', []);

        $this->addIfMissing('navigation.header_menu', []);
        $this->addIfMissing('navigation.show_home_link', true);
        $this->addIfMissing('navigation.show_brands_menu', true);
        $this->addIfMissing('navigation.show_categories_menu', true);

        $this->addIfMissing('tax.default_rate', 0.2);
        $this->addIfMissing('tax.label', 'KDV');
        $this->addIfMissing('tax.category_rates', []);

        $this->addIfMissing('payments.iyzico_enabled', true);
        $this->addIfMissing('payments.iyzico_api_key', '');
        $this->addIfMissing('payments.iyzico_secret_key', '');
        $this->addIfMissing('payments.iyzico_base_url', 'https://sandbox-api.iyzipay.com');
        $this->addIfMissing('payments.iyzico_callback_url', '');
        $this->addIfMissing('payments.iyzico_webhook_secret', '');

        $this->addIfMissing('shipping.free_shipping_enabled', false);
        $this->addIfMissing('shipping.free_shipping_minimum', 0.0);
        $this->addIfMissing('shipping.geliver_enabled', true);
        $this->addIfMissing('shipping.geliver_token', '');
        $this->addIfMissing('shipping.geliver_sender_address_id', '');
        $this->addIfMissing('shipping.geliver_source_identifier', '');
        $this->addIfMissing('shipping.geliver_webhook_verify', false);
        $this->addIfMissing('shipping.geliver_webhook_secret', '');
        $this->addIfMissing('shipping.geliver_default_city_code', '34');
        $this->addIfMissing('shipping.geliver_distance_unit', 'cm');
        $this->addIfMissing('shipping.geliver_mass_unit', 'kg');
        $this->addIfMissing('shipping.geliver_default_length', 10.0);
        $this->addIfMissing('shipping.geliver_default_width', 10.0);
        $this->addIfMissing('shipping.geliver_default_height', 10.0);
        $this->addIfMissing('shipping.geliver_default_weight', 1.0);

        $this->addIfMissing('home.brands_sort_by', 'title');
        $this->addIfMissing('home.brands_sort_direction', 'asc');
        $this->addIfMissing('home.product_grid_sort_by', 'title');
        $this->addIfMissing('home.product_grid_sort_direction', 'asc');

        $this->addIfMissing('catalog.products_per_page', 15);
        $this->addIfMissing('catalog.brands_per_page', 15);
        $this->addIfMissing('catalog.categories_per_page', 15);
        $this->addIfMissing('catalog.tags_per_page', 15);
        $this->addIfMissing('catalog.ingredients_per_page', 15);
    }

    private function addIfMissing(string $property, $value): void
    {
        if (! $this->migrator->exists($property)) {
            $this->migrator->add($property, $value);
        }
    }
};
