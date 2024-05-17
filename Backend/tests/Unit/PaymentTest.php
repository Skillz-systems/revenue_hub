<?php

namespace Tests\Unit;

use App\Models\Payment;
use App\Service\PaymentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;


class PaymentTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic test example.
     */
    public function test_to_see_if_all_payment_can_be_fetched(): void
    {
        Payment::factory(10)->create();
        $getAllPayment = (new PaymentService())->allPayment();
        $this->assertEqals(10,count($getAllPayment));
    }
}
