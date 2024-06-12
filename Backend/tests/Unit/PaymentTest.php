<?php

namespace Tests\Unit;

use App\Models\DemandNotice;
use App\Models\Payment;
use App\Models\Property;
use App\Service\PaymentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Faker\Factory as Faker;
use Flutterwave\Service\VirtualAccount;
use Illuminate\Support\Facades\Http;
use Mockery;
use Mockery\MockInterface;

class PaymentTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic test example.
     */

    private  $faker;

    protected function setUp(): void
    {
        parent::setUp();

        // Setup the fake response
        $this->faker = Faker::create();
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


    public function test_to_see_if_all_payment_can_be_fetched(): void
    {
        $defaultDate = date("Y");
        Payment::factory(50)->create();
        $getAllPayment = (new PaymentService())->allPayment($defaultDate);
        $this->assertEquals(50, count($getAllPayment));
    }

    public function test_to_see_if_a_new_payment_can_be_created()
    {

        $data = [
            "tx_ref" => $this->faker->numberBetween(1000, 1000000),
            "flw_ref" => $this->faker->numberBetween(1000, 1000000),
            "demand_notice_id" => $this->faker->numberBetween(1, 100),
            "actual_amount" => $this->faker->numberBetween(1000, 1000000),
            "charged_amount" => $this->faker->numberBetween(0, 100),
            "app_fee" => $this->faker->numberBetween(0, 100),
            "merchant_fee" => $this->faker->numberBetween(0, 100),
            "webhook_string" => $this->faker->sentence,
        ];
        $createNewPayment = (new PaymentService())->createPayment($data);
        $this->assertEquals($data["actual_amount"], $createNewPayment->actual_amount);
    }
    public function test_to_see_if_a_single_payment_can_be_fetched()
    {

        $payment = Payment::factory()->create();
        $getPayment = (new PaymentService())->viewPayment($payment->id);
        $this->assertEquals($getPayment->tx_ref, $payment->tx_ref);
    }

    public function test_to_see_if_a_single_payment_can_be_updated()
    {
        $data = [
            "tx_ref" => $this->faker->numberBetween(1000, 1000000),
            "flw_ref" => $this->faker->numberBetween(1000, 1000000),
            "demand_notice_id" => $this->faker->numberBetween(1, 100),
            "actual_amount" => $this->faker->numberBetween(1000, 1000000),
            "charged_amount" => $this->faker->numberBetween(0, 100),
            "app_fee" => $this->faker->numberBetween(0, 100),
            "merchant_fee" => $this->faker->numberBetween(0, 100),
            "webhook_string" => $this->faker->sentence,
        ];

        $payment = Payment::factory()->create();
        $updatePayment = (new PaymentService())->updatePayment($payment->id, $data);
        $this->assertEquals($updatePayment, true);
        $getUpdatedPayment = (new PaymentService())->viewPayment($payment->id);
        $this->assertNotEquals($getUpdatedPayment->tx_ref, $payment->tx_ref);
    }

    public function test_to_see_if_a_single_payment_can_be_deleted()
    {
        $payment = Payment::factory()->create();
        $deletePayment = (new PaymentService())->deletePayment($payment->id);
        $this->assertEquals($deletePayment, true);
        $this->assertDatabaseMissing("payments", $payment->toArray());
    }

    // public function test_to_see_if_a_new_account_number_can_be_generated_for_a_demand_notice()
    // {

    //     $getProperty = Property::factory()->create();
    //     DemandNotice::factory()->create(["property_id" => $getProperty->id, "amount" => 500]);
    //     $this->instance(
    //         VirtualAccount::class,
    //         Mockery::mock(VirtualAccount::class, function (MockInterface $mock) {
    //             $mock->shouldReceive('create')->andReturn((object)[
    //                 'status' => 'success',
    //                 'message' => 'Virtual account created',
    //                 'data' => (object)[
    //                     'response_code' => '02',
    //                     'response_message' => 'Transaction in progress',
    //                     'flw_ref' => 'FLW-190d9cb973a3437189d4557ad8060bd1',
    //                     'order_ref' => 'URF_1716145377060_7260635',
    //                     'account_number' => '9586844019',
    //                     'frequency' => 'N/A',
    //                     'bank_name' => 'WEMA BANK',
    //                     'created_at' => '2024-05-19 19:02:57',
    //                     'expiry_date' => '2024-05-19 20:02:57',
    //                     'note' => 'Please make a bank transfer to ICT FLW',
    //                     'amount' => '100.00',
    //                 ],
    //             ]);
    //         })
    //     );
    //     // $mockVirtualAccount->shouldReceive('create')->andReturn((object)[
    //     //     'status' => 'success',
    //     //     'message' => 'Virtual account created',
    //     //     'data' => (object)[
    //     //         'response_code' => '02',
    //     //         'response_message' => 'Transaction in progress',
    //     //         'flw_ref' => 'FLW-190d9cb973a3437189d4557ad8060bd1',
    //     //         'order_ref' => 'URF_1716145377060_7260635',
    //     //         'account_number' => '9586844019',
    //     //         'frequency' => 'N/A',
    //     //         'bank_name' => 'WEMA BANK',
    //     //         'created_at' => '2024-05-19 19:02:57',
    //     //         'expiry_date' => '2024-05-19 20:02:57',
    //     //         'note' => 'Please make a bank transfer to ICT FLW',
    //     //         'amount' => '100.00',
    //     //     ],
    //     // ]);
    //     $generateAccount = (new PaymentService())->createAccountNumber($getProperty->pid);
    //     $accounttoArray = get_object_vars($generateAccount);

    //     $this->assertIsArray($accounttoArray);
    //     $this->assertArrayHasKey('status', $accounttoArray);
    //     $this->assertArrayHasKey('data', $accounttoArray);
    //     $this->assertArrayHasKey('flw_ref', get_object_vars($accounttoArray["data"]));
    // }
}
