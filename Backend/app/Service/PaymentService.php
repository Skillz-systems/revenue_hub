<?php

namespace App\Service;

use App\Http\Resources\StoreUserResource;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Flutterwave\Service\VirtualAccount;

class PaymentService
{
    public function allPayment()
    {
        return $this->model()->paginate(10);
    }
    public function viewPayment($id)
    {
        return $this->model()->findOrFail($id);
    }
    public function createPayment($data)
    {
        return $this->model()->create($data);
    }
    public function updatePayment($id, $data)
    {
        $payment = $this->viewPayment($id);
        return $payment->update($data);
    }
    public function deletePayment($id)
    {
        $payment = $this->viewPayment($id);
        return $payment->delete();
    }

    public function createAccountNumber($demandNoticeId)
    {
        $service = new VirtualAccount();

        $payload = [
            "email" => "kennyio@gmail.com",
            "amount" => 100,
            "expires" => "2678400",
            "tx_ref" => "tx_ref_aabbcc",
            "bvn" => env("BVN"),
        ];

        $response = $service->create($payload);
        return $response;
    }

    private function model()
    {
        return new Payment();
    }
}
