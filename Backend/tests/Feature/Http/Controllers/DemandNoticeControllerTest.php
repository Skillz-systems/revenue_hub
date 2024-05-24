<?php

namespace Tests\Feature\Http\Controllers;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\DemandNotice;
use App\Models\Payment;
use App\Models\Property;

class DemandNoticeControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_to_fetch_all_paginated_demand_notice(): void
    {
        $property = Property::factory()->create();
        $demandNotice = DemandNotice::factory()->create([
            "property_id" => $property->id
        ]);
        $response = $this->actingAsTestUser()->getJson("api/demand-notice");
        $response->assertStatus(200)->assertJsonStructure([
            "status",
            'data' => [
                "*" => [
                    "id",
                    "amount",
                    "arrears_amount",
                    "penalty",
                    "status",
                    "property" => [
                        "id",
                        "pid",


                    ],

                ]
            ]
        ]);
        //dd($response);
    }
    public function test_to_fetch_single_demand_notice(): void
    {
        $property = Property::factory()->create();
        $demandNotice = DemandNotice::factory()->create([
            "property_id" => $property->id
        ]);
        $response = $this->actingAsTestUser()->getJson("/api/demand-notice/view/" . $demandNotice->id);
        $response->assertStatus(200)->assertJsonStructure([
            "status",
            'data' => [
                "id",
                "amount",
                "arrears_amount",
                "penalty",
                "status",
                "property" => [
                    "id",
                    "pid",
                ],


            ]
        ]);
    }

    public function test_to_see_if_a_new_demand_notice_can_be_created(): void
    {
        $property = Property::factory()->create();
        $data = [
            "property_id" => $property->id
        ];
        $response = $this->actingAsTestUser()->postJson("/api/demand-notice/create/", $data);
        $response->assertStatus(201)->assertJsonStructure([
            "status",
            'data' => [
                "id",
                "amount",
                "arrears_amount",
                "penalty",
                "status",
                "property" => [
                    "id",
                    "pid",
                ],


            ]
        ]);
    }


    public function test_to_see_if_a_demand_notice_can_be_deleted()
    {
        $property = Property::factory()->create();
        $demandNotice = DemandNotice::factory()->create([
            "property_id" => $property->id
        ]);

        $response = $this->actingAsTestUser()->deleteJson("/api/demand-notice/delete/" . $demandNotice->id);
        $response->assertStatus(200)->assertJsonStructure([
            "status",
        ]);
    }
}
