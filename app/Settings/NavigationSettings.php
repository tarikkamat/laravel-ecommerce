<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class NavigationSettings extends Settings
{
    public array $header_menu = [];

    public bool $show_home_link = true;
    public bool $show_brands_menu = true;
    public bool $show_categories_menu = true;

    public static function group(): string
    {
        return 'navigation';
    }
}
