<?php

namespace Database\Factories;

use App\Models\DemandNoticeReminder;
use App\Models\DemandNotice;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class DemandNoticeReminderFactory extends Factory
{
    protected $model = DemandNoticeReminder::class;

    public function definition()
    {
        return [
            'demand_notice_id' => DemandNotice::factory(),
            'created_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
        ];
    }
}
