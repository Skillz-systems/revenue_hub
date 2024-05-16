<?php
use App\Models\PaymentService;
use App\Models\AccountNumber;
use App\Models\WebhookData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Flutterwave\Rave;

class PaymentController extends Controller
{
    public function createAccountNumber($demand_notice_id)
    {
        // Fetch payment service data
        $paymentService = PaymentService::where('demand_notice_id', $demand_notice_id)->first();
        if (!$paymentService) {
            return response()->json(['error' => 'Payment service not found'], 404);
        }

        // Initialize Flutterwave
        $rave = new Rave(env('FLUTTERWAVE_SECRET_KEY'));

        // Create account number via Flutterwave
        $data = [
            "email" => "customer@example.com", // Replace with your customer's email
            "amount" => $paymentService->amount,
            "tx_ref" => $demand_notice_id, // Unique transaction reference
        ];

        $response = $rave->createAccount($data);

        if ($response['status'] === 'success') {
            $accountData = $response['data'];

            // Save account data
            $accountNumber = new AccountNumber();
            $accountNumber->demand_notice_id = $demand_notice_id;
            $accountNumber->response_code = $accountData['response_code'];
            $accountNumber->response_message = $accountData['response_message'];
            $accountNumber->order_ref = $accountData['order_ref'];
            $accountNumber->account_number = $accountData['account_number'];
            $accountNumber->bank_name = $accountData['bank_name'];
            $accountNumber->save();

            // Update payment service
            $paymentService->account_number = $accountData['account_number'];
            $paymentService->bank_name = $accountData['bank_name'];
            $paymentService->save();

            return response()->json(['success' => true, 'account_number' => $accountData['account_number']]);
        } else {
            return response()->json(['error' => 'Failed to create account number'], 500);
        }
    }

    public function handleWebhook(Request $request)
    {
        $payload = $request->all();

        // Verify the webhook signature (this is a simple check, enhance as needed)
        $signature = $request->header('verif-hash');
        if ($signature !== env('FLUTTERWAVE_SECRET_KEY')) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        // Save the webhook data
        $webhookData = new WebhookData();
        $webhookData->data = json_encode($payload); // Store the entire payload as JSON
        $webhookData->save();

        // Process the webhook payload
        if ($payload['event'] === 'charge.completed' && $payload['data']['status'] === 'successful') {
            $txRef = $payload['data']['tx_ref'];

            $paymentService = PaymentService::where('demand_notice_id', $txRef)->first();
            if ($paymentService) {
                $paymentService->status = 'completed';
                $paymentService->save();
            }
        }

        return response()->json(['status' => 'success'], 200);
    }
}
