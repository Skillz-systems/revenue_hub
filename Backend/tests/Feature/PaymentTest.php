<?php

namespace Tests\Feature;

use App\Models\DemandNotice;
use App\Models\Payment;
use App\Models\Property;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Support\Facades\Http;

class PaymentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Setup the fake response
        Http::fake([
            'https://api.flutterwave.com/v3/virtual-account-numbers' => Http::response([
                "status" => "success",
                "message" => "Virtual account created",
                "data" => [
                    "response_code" => "02",
                    "response_message" => "Transaction in progress",
                    "flw_ref" => "FLW-190d9cb973a3437189d4557ad8060bd1",
                    "order_ref" => "URF_1716145377060_7260635",
                    "account_number" => "9586844019",
                    "frequency" => "N/A",
                    "bank_name" => "WEMA BANK",
                    "created_at" => "2024-05-19 19:02:57",
                    "expiry_date" => "2024-05-19 20:02:57",
                    "note" => "Please make a bank transfer to ICT FLW",
                    "amount" => "100.00",
                ]
            ], 200),
        ]);
    }
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
    public function test_to_fetch_single_payments(): void
    {
        $property = Property::factory()->create();
        //DemandNotice::factory()->count(1)->make(["property_id" => (Property::factory()->create())->id])->create())->id
        $demandNotice = DemandNotice::factory()->create([
            "property_id" => $property->id
        ]);

        Payment::factory(50)->create(['demand_notice_id' => $demandNotice->id]);
        $response = $this->actingAsTestUser()->getJson("/api/payment/view/1");
        $response->assertStatus(200)->assertJsonStructure([
            "status",
            'data' => [
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
        ]);
    }

    // public function test_to_see_if_an_account_can_be_linked_to_a_demand_notice(): void
    // {
    //     $property = Property::factory()->create(["pid" => "223321343"]);
    //     //DemandNotice::factory()->count(1)->make(["property_id" => (Property::factory()->create())->id])->create())->id
    //     $demandNotice = DemandNotice::factory()->create([
    //         "property_id" => $property->id
    //     ]);
    //     $response = $this->actingAsTestUser()->getJson("/api/payment/generate-account/223321343");
    //     $response->assertStatus(200)->assertJsonStructure([
    //         "status",
    //         'data' => [
    //             "data" => [
    //                 "flw_ref",
    //                 "order_ref",
    //                 "account_number",
    //                 "frequency",
    //                 "bank_name",
    //                 "note",
    //                 "amount",
    //             ]
    //         ]
    //     ]);
    // }
}
