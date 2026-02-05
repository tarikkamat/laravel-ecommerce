<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class SiteSettings extends Settings
{
    public string $site_title = 'SUUG';
    public string $meta_description = '';
    public string $meta_keywords = '';

    public string $header_logo_path = '';
    public string $header_logo_text = 'SUUG';
    public string $header_logo_tagline = 'BEAUTY';

    public string $footer_logo_path = '';
    public string $footer_logo_text = 'SUUG';
    public string $footer_description = '';
    public string $footer_copyright = '';

    public string $seller_name = '';
    public string $seller_address = '';
    public string $seller_phone = '';
    public string $seller_email = '';

    public bool $whatsapp_enabled = false;
    public string $whatsapp_phone = '';
    public string $whatsapp_message = 'Selamlar, bu ürünü almak istiyorum.';

    public bool $announcement_enabled = false;
    public string $announcement_text = '';
    public int $announcement_speed_seconds = 18;
    public string $announcement_background = '#181113';
    public string $announcement_text_color = '#ffffff';

    public array $footer_bottom_links = [];

    public array $footer_socials = [];

    public array $footer_menus = [];

    public static function group(): string
    {
        return 'site';
    }
}
