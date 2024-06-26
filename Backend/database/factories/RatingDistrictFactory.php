<?php

namespace Database\Factories;

use App\Models\OfficeZone;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RatingDistrict>
 */
class RatingDistrictFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement(['APO', 'DUROMI']),
            "office_zone_id" => OfficeZone::inRandomOrder()->first()->id,
        ];
    }
}
