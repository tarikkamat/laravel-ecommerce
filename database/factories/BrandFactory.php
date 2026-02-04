<?php

namespace Database\Factories;

use App\Models\Brand;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Brand>
 */
class BrandFactory extends Factory
{
    protected $model = Brand::class;

    public function definition(): array
    {
        $title = $this->faker->unique()->company();

        return [
            'image_id' => null,
            'slug' => Str::slug($title).'-'.$this->faker->unique()->numberBetween(1, 9999),
            'title' => $title,
            'description' => $this->faker->optional()->sentence(),
            'seo_title' => null,
            'seo_description' => null,
        ];
    }
}
