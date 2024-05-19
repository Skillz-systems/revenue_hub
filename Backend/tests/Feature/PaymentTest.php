<?php

namespace Tests\Feature;

use App\Models\DemandNotice;
use App\Models\Payment;
use App\Models\Property;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PaymentTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic feature test example.
     */
    public function test_to_fetch_all_paginated_payments(): void
    {
        $property = Property::factory()->create();
        //DemandNotice::factory()->count(1)->make(["property_id" => (Property::factory()->create())->id])->create())->id
        $demandNotice = DemandNotice::factory()->create([
            "property_id" => $property->id
        ]);

        Payment::factory(50)->create(['demand_notice_id' => $demandNotice->id]);
        $response = $this->actingAsTestUser()->getJson("/api/payment");
        $response->assertStatus(200)->assertJsonStructure([
            "status",
            'data' => [
                "*" => [
                    "tx_ref",
                    "pin",
                    "demand_notice" => [
                        "id", "amount",
                        "property" => ["pid"]
                    ],
                    "actual_amount",
                    "charged_amount",
                    "app_fee",
                    "merchant_fee",
                    "status",
                ]
            ]
        ]);
        //dd($response);
    }
}
