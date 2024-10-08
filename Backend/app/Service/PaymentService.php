<?php

namespace App\Service;

use App\Http\Resources\StoreUserResource;
use App\Models\DemandNoticeAccount;
use App\Models\NibssKeys;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Flutterwave\Service\VirtualAccount;

class PaymentService
{
    public function allPayment($date)
    {
        return $this->model()->whereYear('created_at', $date)->paginate(100);
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
        $getDemandNotice = $getProperty->demandNotices()->latest()->first();
        $service = new VirtualAccount();

        //ensure that link would only be created as new if there is no matching records, else an update of account details would be done 
        $email = $getProperty->pid . "@revenuhub.ng";
        $tx_ref = $getProperty->pid . "_" . time();
        $amount = $getDemandNotice->amount;
        $payload = [
            "email" => $email,
            "amount" => $amount,
            "tx_ref" => $tx_ref,
            "narration" => "Amac Skillz systems Tenement",
            "bvn" => env("BVN"),
        ];
        $response = $service->create($payload);
        // link account to demand notice 
        if ($response) {
            // check if record exist 

            $checkAccount = DemandNoticeAccount::where(["demand_notice_id" => $getDemandNotice->id])->first();
            if ($checkAccount) {
                $accountNumberCreated = $checkAccount->update([
                    "account_number" => $response->data->account_number,
                    "account_name" => $response->data->note,
                    "account_bank_name" => $response->data->bank_name,
                    "tx_ref" => $tx_ref,
                ]);
            } else {
                $accountNumberCreated = DemandNoticeAccount::create([
                    "demand_notice_id" => $getDemandNotice->id,
                    "tx_ref" => $tx_ref,
                    "account_number" => $response->data->account_number,
                    "account_name" => $response->data->note,
                    "account_bank_name" => $response->data->bank_name,
                    "account_email" => $email,
                    "amount" => $amount,
                ]);
            }
        } else {
            return false;
        }

        if ($accountNumberCreated) {
            return $response;
        }
        return false;
    }

    public function totalNumberOfPaymentByYear($data)
    {
        return $this->model()->whereYear('created_at', $data)->count();
    }

    public function getAccountNumberByTxRef($txRef)
    {
        return DemandNoticeAccount::where("tx_ref", $txRef)->first();
    }

    public function createOrUpdateNibssKey($data)
    {
        $model = new NibssKeys();
        // check if a key exists 
        $getKey = $this->getNibssKey($data["key_name"]);
        if ($getKey) {
            return $getKey->update($data);
        }

        //create a new key 
        return $model->create($data);
    }

    public function getNibssKey($data)
    {
        $model = new NibssKeys();
        $nibssKey = $model->where(["key_name" => $data])->first();

        if ($nibssKey) {
            return $nibssKey;
        }
        return false;
    }
    public function model()
    {
        return new Payment();
    }
}
