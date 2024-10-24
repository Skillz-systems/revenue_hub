<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Group;
use App\Models\Street;
use App\Models\Payment;
use App\Models\Category;
use App\Models\Property;
use App\Models\OfficeZone;
use App\Models\PropertyUse;
use App\Models\DemandNotice;
use App\Models\PropertyType;
use Illuminate\Http\Request;
use App\Models\CadastralZone;
use Illuminate\Http\Response;
use App\Models\RatingDistrict;
use App\Service\PaymentService;
use App\Models\DemandNoticeAccount;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Config;
use App\Http\Controllers\PaymentController;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

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

        // create keys
        $data = [
            'AES_IV' => "1c69eabb257ef4cc",
            'SECRET_KEY' => "e2d54a44e8d27955",
        ];

        foreach ($data as $keyName => $key) {
            $model = new PaymentService();
            $model->createOrUpdateNibssKey(["key_name" => $keyName, "key" => $key]);
        }
    }
    /**
     * A basic feature test example.
     */
    public function test_to_fetch_all_paginated_payments(): void
    {
        OfficeZone::factory()->create();
        RatingDistrict::factory()->create();
        CadastralZone::factory()->create();
        Street::factory()->create();
        PropertyType::factory()->create();
        PropertyUse::factory()->create();
        Category::factory()->create();
        Group::factory()->create();
        $property = Property::factory()->create();
        $demandNotice = DemandNotice::factory()->create([
            "property_id" => $property->id
        ]);

        Payment::factory(50)->create(['demand_notice_id' => $demandNotice->id]);
        $response = $this->actingAsTestUser()->postJson("/api/payment");
        $response->assertStatus(200)->assertJsonStructure([
            "status",
            'data' => [
                "*" => [
                    "tx_ref",
                    "pin",
                    "demand_notice" => [
                        "id",
                        "amount",
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
        OfficeZone::factory()->create();
        RatingDistrict::factory()->create();
        CadastralZone::factory()->create();
        Street::factory()->create();
        PropertyType::factory()->create();
        PropertyUse::factory()->create();
        Category::factory()->create();
        Group::factory()->create();
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
                    "id",
                    "amount",
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


    public function test_to_see_if_a_demand_notice_payment_can_be_created(): void
    {
        $data =
            [
                "id" => 1415777651,
                "txRef" => "19398114_1717176169",
                "flwRef" => "100006240531182421257424789154",
                "orderRef" => "URF_1717176169673_30835",
                "paymentPlan" => null,
                "paymentPage" => null,
                "createdAt" => "2024-05-31T17:24:39.000Z",
                "amount" => 50,
                "charged_amount" => 50,
                "status" => "successful",
                "IP" => "::ffff:172.16.30.14",
                "currency" => "NGN",
                "appfee" => 0.7,
                "merchantfee" => 0,
                "merchantbearsfee" => 1,
                "customer" => [
                    "id" => 889141038,
                    "phone" => "08012345678",
                    "fullName" => "Anonymous customer",
                    "customertoken" => null,
                    "email" => "19398114@revenuhub.ng",
                    "createdAt" => "2024-05-31T07:34:26.000Z",
                    "updatedAt" => "2024-05-31T07:34:26.000Z",
                    "deletedAt" => null,
                    "AccountId" => 22129,
                ],
                "entity" => [
                    "account_number" => "7070173013",
                    "first_name" => "KINGSLEY CHIBUIKE",
                    "last_name" => "ACHUMIE",
                    "createdAt" => "2024-05-31T17:01:02.000Z",
                ],
            ];


        $property = Property::factory()->create();
        $demandNotice = DemandNotice::factory()->create([
            "property_id" => $property->id
        ]);
        DemandNoticeAccount::factory()->create([
            "demand_notice_id" => $demandNotice->id,
            "amount" => "30020",
            "tx_ref" => "19398114_1717176169",
        ]);
        $response = $this->postJson("/api/payment/webhook", $data);

        $this->assertDatabaseHas('payments', [
            "demand_notice_id" => $demandNotice->id
        ]);
        $response->assertStatus(200)->assertJsonStructure([
            "status",
            "message",
            "data"
        ]);
    }

    /**
     * Test valid transaction where amount matches the expected amount.
     *
     * @return void
     */
    public function test_valid_transaction()
    {

        $rating = RatingDistrict::factory()->create();
        $cadastral = CadastralZone::factory()->create();
        $street = Street::factory()->create();
        $property = Property::factory()->create(
            [
                "pid" => "223321343",
                "rating_district_id" => $rating->id,
                "cadastral_zone_id" => $cadastral->id,
                "street_id" => $street->id
            ]

        );
        DemandNotice::factory()->create([
            "property_id" => $property->id,
            "amount" => 1000
        ]);
        $payload = [
            'ProductID' => '223321343',
            'Amount' => 1000,
            "Params" => [
                "Occupier" => "223321343",
            ]
        ];

        $encryptedPayload = $this->encryptPayload($payload);
        $response = $this->postJson('api/validate', [], ["HASH" => $encryptedPayload, "SIGNATURE" => $this->getSignature()]);
        $response->assertStatus(200);
        $decryptedResponse = $this->decryptResponse($response->getContent());

        $this->assertFalse($decryptedResponse['HasError']);
        $this->assertEquals('Transaction validated successfully.', $decryptedResponse['Message']);
    }

    /**
     * Test invalid transaction where amount does not match the expected amount.
     *
     * @return void
     */
    public function test_invalid_transaction_amount_mismatch()
    {
        $rating = RatingDistrict::factory()->create();
        $cadastral = CadastralZone::factory()->create();
        $street = Street::factory()->create();
        $property = Property::factory()->create(
            [
                "pid" => "223321343",
                "rating_district_id" => $rating->id,
                "cadastral_zone_id" => $cadastral->id,
                "street_id" => $street->id
            ]

        );
        DemandNotice::factory()->create([
            "property_id" => $property->id,
            "amount" => 1000
        ]);
        $payload = [
            'ProductID' => '223321343',
            'Amount' => 500,
            "Params" => [
                "Occupier" => "223321343",
            ]
        ];

        $encryptedPayload = $this->encryptPayload($payload);

        $response = $this->postJson('api/validate', [], ["HASH" => $encryptedPayload, "SIGNATURE" => $this->getSignature()]);
        $response->assertStatus(200);

        $decryptedResponse = $this->decryptResponse($response->getContent());

        $this->assertTrue($decryptedResponse['HasError']);
        $this->assertEquals('provided amount is wrong', $decryptedResponse['Message']);
    }

    /**
     * Test invalid transaction with malformed payload.
     *
     * @return void
     */
    // public function test_malformed_payload()
    // {
    //     $malformedPayload = 'not a valid payload';

    //     $response = $this->postJson('api/validate', ["Params" => $malformedPayload]);

    //     $response->assertStatus(400); // Bad Request
    // }

    /**
     * Test transaction with missing fields in payload.
     *
     * @return void
     */
    // public function test_transaction_with_missing_fields()
    // {
    //     $payload = [
    //         // 'ProductID' is missing
    //         'Amount' => 1000,
    //         'Params' => ['param1' => 'value1', 'param2' => 'value2']
    //     ];

    //     $encryptedPayload = $this->encryptPayload($payload);

    //     $response = $this->postJson('api/validate', ["Params" => $encryptedPayload]);

    //     $response->assertStatus(400); // Bad Request
    //     $decryptedResponse = $this->decryptResponse($encryptedPayload);
    //     $this->assertTrue($decryptedResponse['HasError']);
    //     $this->assertContains('Missing required fields', $decryptedResponse['Message']);
    // }

    /**
     * Test transaction with extra fields in payload.
     *
     * @return void
     */
    // public function test_transaction_with_extra_fields()
    // {
    //     // Mock the getDemandNoticeWithPropertyPid to return a specific amount
    //     $this->mockBillerService(1000);

    //     $payload = [
    //         'ProductID' => '12345',
    //         'Amount' => 1000,
    //         'ExtraField' => 'should not be here',
    //         'Params' => ['param1' => 'value1', 'param2' => 'value2']
    //     ];

    //     $encryptedPayload = $this->encryptPayload($payload);

    //     $response = $this->postJson('/validate', $encryptedPayload);

    //     $response->assertStatus(200);
    //     $decryptedResponse = $this->decryptResponse($response->getContent());
    //     $this->assertFalse($decryptedResponse['HasError']);
    // }

    /**
     * Test transaction with empty payload.
     *
     * @return void
     */
    // public function test_empty_payload()
    // {
    //     $response = $this->postJson('/validate', []);

    //     $response->assertStatus(400); // Bad Request
    //     $decryptedResponse = $this->decryptResponse($response->getContent());
    //     $this->assertTrue($decryptedResponse['HasError']);
    //     $this->assertContains('Payload cannot be empty', $decryptedResponse['Message']);
    // }





    public function test_valid_notification()
    {

        $property = Property::factory()->create(["pid" => "223321343"]);
        DemandNotice::factory()->create([
            "property_id" => $property->id,
            "amount" => 1000
        ]);
        $payload = [
            "SessionId" => "C85201 4 - 8 EC 0 - 63 2 - 7 C 98 - 39 -63215a58",
            "TransactionDate" => "06/10/11",
            "TransactionTime" => "15:24:16",
            "Amount" => 1000,
            "ChannelCode" => "USSD",
            "BankName" => "Zenith Bank",
            "BranchName" => "Ikeja",
            "BillerName" => "Biller_Name",
            "NotificationEndPoint" => "Biller_Notification_Endpoint",
            "ProductID" => "223321343",
            "DestinationInstitutionCode" => "999998",
            "Params" => [
                "Occupier" => "223321343",
            ]
        ];

        $encryptedPayload = $this->encryptPayload($payload);

        $response = $this->postJson('api/notify', [], ["HASH" => $encryptedPayload, "SIGNATURE" => $this->getSignature()]);

        $response->assertStatus(200);
        $decryptedResponse = $this->decryptResponse($response->getContent());
        $this->assertFalse($decryptedResponse['HasError']);
        $this->assertEquals('Transaction Completed', $decryptedResponse['Message']);
    }

    /** @test */
    public function it_resets_keys_and_sends_email()
    {
        // Fake the mail to intercept the email that is sent


        Mail::fake();

        // Call the resetKeys endpoint
        $response = $this->postJson('/api/reset', [], ["SIGNATURE" => $this->getSignature()]);

        // Assert the response is successful and has the correct status
        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'IV and SECRET KEY have been reset and sent to NIBSS.',
            ]);

        // Check if an email was sent to the specified address
        Mail::assertSent(\App\Mail\ResetKeysMail::class, function ($mail) {
            return $mail->hasTo(env("NIBSS_EMAIL"));
        });

        // Fetch the new IV and SECRET_KEY from the configuration (simulated)
        $newIv = $this->nibssModel()->getNibssKey("AES_IV")->key;
        $newSecret = $this->nibssModel()->getNibssKey("SECRET_KEY")->key;

        // Ensure the new IV and SECRET_KEY have been set and are not null
        $this->assertNotEquals($newIv, "8aa9149ae7020648");
        $this->assertNotEquals($newSecret, "OJta0qzFaPCW8WZLzrmsCHJL48qWsuZn");


        // Check if the length of the new IV is correct (16 characters)
        $this->assertEquals(16, strlen($newIv));

        // Check if the length of the new SECRET_KEY is correct (32 characters)
        //$this->assertEquals(32, strlen($newSecret));
    }



    private function nibssModel()
    {
        return (new PaymentService());
    }

    private function decryptResponse($response)
    {
        $iv = $this->nibssModel()->getNibssKey("AES_IV")->key;
        $secretKey = $this->nibssModel()->getNibssKey("SECRET_KEY")->key;

        $decryptedData = openssl_decrypt(hex2bin($response), 'AES-128-CBC', $secretKey, OPENSSL_RAW_DATA, $iv);
        return json_decode($decryptedData, true);
    }


    private function getSignature()
    {
        $date = now()->format('Ymd');
        $secret = $this->nibssModel()->getNibssKey("SECRET_KEY")->key;;
        $signature = hash('sha256', $date . $secret);
        return $signature;
    }

    // Helper methods to encrypt and decrypt payloads
    private function encryptPayload(array $payload)
    {
        $iv = $this->nibssModel()->getNibssKey("AES_IV")->key;
        $secretKey = $this->nibssModel()->getNibssKey("SECRET_KEY")->key;

        $encryptedData = openssl_encrypt(json_encode($payload), 'AES-128-CBC', $secretKey, OPENSSL_RAW_DATA, $iv);
        return bin2hex($encryptedData);
    }
}
