<?php

namespace App\Service;

use App\Http\Resources\StoreUserResource;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class PaymentService
{
    public function allPayment()
    {
        return $this->model()->paginate(10);
    }
    public function viewPayment()
    {
    }
    public function createPayment()
    {
    }
    public function updatePayment()
    {
    }
    public function deletePayment()
    {
    }

    private function model(){
        return new Payment();
    }
}
