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
            'street_id' => Street::inRandomOrder()->first()->id,
            'asset_no' => 'AMC/B14/TR/' . fake()->randomDigit(),
            'cadastral_zone_id' => CadastralZone::inRandomOrder()->first()->id,
            'property_type_id' => PropertyType::inRandomOrder()->first()->id,
            'property_use_id' => PropertyUse::inRandomOrder()->first()->id,
            'rating_district_id' => RatingDistrict::inRandomOrder()->first()->id,
            'annual_value' => fake()->randomElement(['200000', '30000000', '4500000']),
            'rate_payable' => fake()->randomElement(['25000', '45000', '48625']),
            //'arrears'  => fake()->randomElement(['25000', '45000', '48625']),
            //'penalty'  => fake()->randomElement(['25000', '45000', '48625']),
            'grand_total' => fake()->randomElement(['2500000', '4500000', '4862500']),
            'category_id' => Category::inRandomOrder()->first()->id,
            'group_id' => Group::inRandomOrder()->first()->id,
            'active' => 'ACTIVE',
        ];
    }
}
