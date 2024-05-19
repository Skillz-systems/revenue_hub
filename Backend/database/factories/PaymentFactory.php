<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "tx_ref" => $this->faker->numberBetween(1000, 1000000),
            "flw_ref" => $this->faker->numberBetween(1000, 1000000),
            "demand_notice_id" => $this->faker->numberBetween(1, 100),
            "actual_amount" => $this->faker->numberBetween(1000, 1000000),
            "charged_amount" => $this->faker->numberBetween(0, 100),
            "app_fee" => $this->faker->numberBetween(0, 100),
            "merchant_fee" => $this->faker->numberBetween(0, 100),
            "webhook_string" => $this->faker->sentence,
        ];
    }
}
