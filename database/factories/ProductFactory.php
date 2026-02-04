<?php

namespace Database\Factories;

use App\Models\Brand;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $title = $this->faker->unique()->words(3, true);
        $price = $this->faker->randomFloat(2, 100, 2000);
        $hasSale = $this->faker->boolean(30);

        return [
            'brand_id' => Brand::factory(),
            'slug' => Str::slug($title).'-'.$this->faker->unique()->numberBetween(1, 9999),
            'title' => Str::title($title),
            'description' => $this->faker->optional()->paragraph(),
            'seo_title' => null,
            'seo_description' => null,
            'sku' => strtoupper(Str::random(10)),
            'price' => $price,
            'sale_price' => $hasSale ? round($price * 0.9, 2) : null,
            'stock' => $this->faker->numberBetween(5, 50),
            'barcode' => null,
            'active' => true,
        ];
    }
}
