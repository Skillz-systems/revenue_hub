<?php

namespace Database\Factories;

use App\Models\RatingDistrict;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CadastraZone>
 */
class CadastralZoneFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'rating_district_id' => RatingDistrict::inRandomOrder()->first()->id,
        ];
    }
}
