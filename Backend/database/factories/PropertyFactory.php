<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Property>
 */
class PropertyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'pid' => fake()->randomNumber(8),
            'occupant' => fake()->name(),
            'prop_addr' => fake()->address(),
            'street_name' => fake()->streetAddress(),
            'asset_no' => 'AMC/B14/TR/' . fake()->randomDigit(),
            'cadastral_zone' => fake()->postcode(),
            'prop_type' => fake()->randomElement(['SPLITTED', 'CONSOLIDATED']),
            'prop_use' => fake()->randomElement(['RESIDENTIAL', 'COMMERCIAL']),
            'rating_dist' => fake()->randomElement(['APO', 'DUROMI']),
            'annual_value' => fake()->randomElement(['200000', '30000000', '4500000']),
            'rate_payable' => fake()->randomElement(['25000', '45000', '48625']),
            'arrears'  => fake()->randomElement(['25000', '45000', '48625']),
            'penalty'  => fake()->randomElement(['25000', '45000', '48625']),
            'grand_total' => fake()->randomElement(['2500000', '4500000', '4862500']),
            'category' => fake()->randomElement(['RESIDENTIAL', 'SCHOOL', 'NULL']),
            'group' => fake()->randomElement(['AMAC1', 'AMAC2']),
            'active' => 'ACTIVE',
        ];
    }
}
