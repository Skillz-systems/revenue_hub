<?php

namespace Database\Factories;

use App\Models\CadastralZone;
use App\Models\Category;
use App\Models\Group;
use App\Models\PropertyType;
use App\Models\PropertyUse;
use App\Models\RatingDistrict;
use App\Models\Street;
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
            'street_id' => 1,
            'asset_no' => 'AMC/B14/TR/' . 1,
            'cadastral_zone_id' => 1,
            'property_type_id' => 1,
            'property_use_id' => 1,
            'rating_district_id' => 1,
            'annual_value' => fake()->randomElement(['200000', '30000000', '4500000']),
            'rate_payable' => fake()->randomElement(['25000', '45000', '48625']),
            //'arrears'  => fake()->randomElement(['25000', '45000', '48625']),
            //'penalty'  => fake()->randomElement(['25000', '45000', '48625']),
            'grand_total' => fake()->randomElement(['2500000', '4500000', '4862500']),
            'category_id' => 1,
            'group_id' => 1,
            'active' => 'ACTIVE',
        ];
    }
}
