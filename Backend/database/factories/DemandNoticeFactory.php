<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DemandNotice>
 */
class DemandNoticeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "property_id" => $this->faker->numberBetween(1000, 1000000),
            "amount" => $this->faker->numberBetween(1000, 1000000),
        ];
    }
}
