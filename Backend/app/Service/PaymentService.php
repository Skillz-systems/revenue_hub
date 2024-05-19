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

    public function createAccountNumber($propertyId)
    {
        //revenapi.com/payment/generate-acccount/id

        $getProperty = (new PropertyService())->getProperty($propertyId);
        $service = new VirtualAccount();

        // email would be property number with revenuhub prefix
        // amount would be demand nonice amount 
        //randum tx_ref using timestamp
        //ensure that link would only be created as new if there is no matching records, else an update of account details would be done 

        $payload = [
            "email" => "kennyio@gmail.com",
            "amount" => 100,
            "tx_ref" => "tx_ref_aabbcceree",
            "bvn" => env("BVN"),
        ];

        $response = $service->create($payload);
        return $response;
    }

    public function model()
    {
        return new Payment();
    }
}
