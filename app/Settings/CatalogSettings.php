<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class CatalogSettings extends Settings
{
    public int $products_per_page = 15;
    public int $brands_per_page = 15;
    public int $categories_per_page = 15;
    public int $tags_per_page = 15;
    public int $ingredients_per_page = 15;

    public static function group(): string
    {
        return 'catalog';
    }
}
