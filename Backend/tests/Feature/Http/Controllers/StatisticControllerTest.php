<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\DemandNotice;
use App\Models\Payment;
use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class StatisticControllerTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic feature test example.
     */
    public function test_to_fetch_statistic_data_for_the_current_year(): void
    {
        Property::factory(5)->create();
        DemandNotice::factory()->create([
            "property_id" => 1
        ]);
        DemandNotice::factory()->create([
            "property_id" => 2
        ]);
        DemandNotice::factory()->create([
            "property_id" => 3
        ]);
        DemandNotice::factory()->create([
            "property_id" => 4,
            "status" => 1
        ]);
        DemandNotice::factory()->create([
            "property_id" => 5
        ]);

        User::factory()->create(['role_id' => 1]);
        User::factory(4)->create(['role_id' => 2]);
        Payment::factory()->create(["demand_notice_id" => 1]);
        Payment::factory()->create(["demand_notice_id" => 2]);
        Payment::factory()->create(["demand_notice_id" => 3]);
        Payment::factory()->create(["demand_notice_id" => 4]);
        Payment::factory()->create(["demand_notice_id" => 5]);

        $response = $this->actingAsTestUser()->postJson("api/statistic/all-yearly-data");
        $response->assertStatus(200)->assertJsonStructure(
            [
                "status",
                'data' => [

                    "total_payments",
                    "total_demand_notices",
                    "total_paid_demand_notices",
                    "total_pending_demand_notices",
                    "total_demand_notices_amount",
                    "total_properties",
                    "total_users",


                ],


            ]
        );
    }
}
