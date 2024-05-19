<?php

namespace Tests\Unit;

use App\Models\Payment;
use App\Service\PaymentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Faker\Factory as Faker;




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
        $this->faker = Faker::create();
    }


    public function test_to_see_if_all_payment_can_be_fetched(): void
    {
        Payment::factory(50)->create();
        $getAllPayment = (new PaymentService())->allPayment();
        $this->assertEquals(10, count($getAllPayment));
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

    public function test_to_see_if_a_new_account_number_can_be_generated_for_a_demand_notice()
    {
        $generateAccount = (new PaymentService())->createAccountNumber(1);
        $accounttoArray = $generateAccount->toArray();
        $this->assertIsArray($accounttoArray);
        $this->assertArrayHasKey('status', $accounttoArray);
        $this->assertArrayHasKey('data', $accounttoArray);
        $this->assertArrayHasKey('flw_ref', $accounttoArray["data"]);
    }
}
