<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class HomeSettings extends Settings
{
    public string $brands_sort_by = 'title';
    public string $brands_sort_direction = 'asc';

    public string $product_grid_sort_by = 'title';
    public string $product_grid_sort_direction = 'asc';

    public int $hero_autoplay_ms = 6000;
    public array $hero_slides = [
        [
            'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQL5iZqD_1HNJ8A0EJklJjaRIPkQy3OXCzf-8858m7Rh8NDRUhK-QoWOzT-iqbMUDJbgi1_whJ9F_SNC6Inxmp-st6ihH7E1TS0FfnKuoyzfyELiJIzlY4W-u9X6mJ-ousZKM8DprTYpaxcnc6qQAh85LdmrMM9h0Ds6hy0dfWGrypdQVtYveq56fx7n29_JA7lcMsRh1DjeaBarkRgYZdiQuibi3_uhG4FmYYTUbPud7DMKP6ju6pexVZNupba0SvQB4AGF73LAg',
            'eyebrow' => '%100 Güvenli Alışveriş',
            'title' => "Suug ile\nGüzelliğe Güven",
            'subtitle' => 'Orijinal ürünler, güvenli ödeme ve hızlı teslimat. Cildinize en iyisini sunmak için titizlikle seçilmiş dünya markalarını keşfedin.',
            'buttons' => [
                [
                    'label' => 'Ürünleri Keşfet',
                    'url' => '/urunler',
                    'variant' => 'primary',
                ],
                [
                    'label' => 'Markalar',
                    'url' => '/markalar',
                    'variant' => 'secondary',
                ],
            ],
        ],
    ];

    public static function group(): string
    {
        return 'home';
    }
}
