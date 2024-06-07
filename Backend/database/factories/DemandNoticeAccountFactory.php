<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DemandNoticeAccount>
 */
class DemandNoticeAccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "demand_notice_id" => $this->faker->numberBetween(1000, 1000000),
            "tx_ref" => $this->faker->numberBetween(1000, 1000000),
            "account_number" => $this->faker->numberBetween(1000, 1000000),
            "account_name" => $this->faker->name(),
            "account_bank_name" => "WEMA",
            "account_email" => $this->faker->email(),
            "amount" => "500",
        ];
    }
}
