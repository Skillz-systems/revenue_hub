<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Support\Str;
use App\Models\DemandNotice;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Service\PaymentService;
use App\Service\PropertyService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Service\DemandNoticeService;
use Illuminate\Support\Facades\Mail;
use App\Http\Resources\PaymentResource;
use Illuminate\Support\Facades\Artisan;

class PaymentController extends Controller
{
    protected $paymentService;
    protected $propertyService;
    protected $demandNoticeService;

    public function __construct(PaymentService $paymentService, PropertyService $propertyService, DemandNoticeService $demandNoticeService)
    {
        $this->paymentService = $paymentService;
        $this->propertyService = $propertyService;
        $this->demandNoticeService = $demandNoticeService;
    }

    /**
     * @OA\Post(
     *     path="/payment",
     *     summary="Get a list of payments",
     *     tags={"Payment"},
     *      @OA\Parameter(
     *         name="date_filter",
     *         in="query",
     *         description="Optional. The year for which to retrieve data. Defaults to the current year if not provided.",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/PaymentResource")
     *         ),
     *         @OA\Header(
     *             header="X-Pagination-Current-Page",
     *             description="Current page of the collection",
     *             @OA\Schema(type="integer")
     *         ),
     *         @OA\Header(
     *             header="X-Pagination-Per-Page",
     *             description="Number of items per page",
     *             @OA\Schema(type="integer")
     *         ),
     *         @OA\Header(
     *             header="X-Pagination-Total",
     *             description="Total number of items",
     *             @OA\Schema(type="integer")
     *         ),
     *         @OA\Header(
     *             header="X-Pagination-Last-Page",
     *             description="Number of the last page",
     *             @OA\Schema(type="integer")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Unauthenticated."
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="This action is unauthorized."
     *             )
     *         )
     *     ),
     *     security={{"bearerAuth":{}}}
     * )
     */
    public function index(Request $request)
    {
        $defaultDate = date("Y");
        if ($request->date_filter) {
            $defaultDate = $request->date_filter;
        }
        $service = $this->paymentService;
        $getPaginatedPayments = $service->allPayment($defaultDate);
        $payments = PaymentResource::collection($getPaginatedPayments);
        $payments->additional([
            'status' => 'success' // or any other status you want to append
        ]);
        return $payments;
    }

    /**
     * @OA\Get(
     *     path="/payment/view/{paymentId}",
     *     summary="Get a specific payment",
     *     tags={"Payment"},
     *     @OA\Parameter(
     *         name="paymentId",
     *         in="path",
     *         required=true,
     *         description="ID of the payment to view",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(ref="#/components/schemas/PaymentResource")
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Unauthenticated."
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="This action is unauthorized."
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Payment not found",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Payment not found"
     *             )
     *         )
     *     ),
     *     security={{"bearerAuth":{}}}
     * )
     */
    public function view($id)
    {
        $service = $this->paymentService;
        $getPayment = $service->viewPayment($id);
        $payments = new PaymentResource($getPayment);
        $payments->additional([
            'status' => 'success' // or any other status you want to append
        ]);
        return $payments;
    }

    /**
     * @OA\Get(
     *     path="/payments/generate-account/{propertyPID}/",
     *     summary="Generate an account number for a demand notice  ",
     *     tags={"Payment"},
     *     @OA\Parameter(
     *         name="propertyPID",
     *         in="path",
     *         required=true,
     *         description="PID of the property to generate an account number for",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="status",
     *                 type="string",
     *                 example="success"
     *             ),
     * 
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(
     *                     property="response_message",
     *                     type="string",
     *                     example="Transaction in progress"
     *                 ),
     *                 @OA\Property(
     *                     property="response_code",
     *                     type="string",
     *                     example="02"
     *                 ),
     *                 @OA\Property(
     *                     property="flw_ref",
     *                     type="string",
     *                     example="GPCY5711171682908639919735"
     *                 ),
     *                 @OA\Property(
     *                     property="order_ref",
     *                     type="string",
     *                     example="URF_1716829079964_1906235"
     *                 ),
     *                 @OA\Property(
     *                     property="frequency",
     *                     type="string",
     *                     example="NA"
     *                 ),
     *                 @OA\Property(
     *                     property="bank_name",
     *                     type="string",
     *                     example="Sterling Bank"
     *                 ),
     *                 @OA\Property(
     *                     property="created_at",
     *                     type="string",
     *                     example="2024-05-27 17:58:06"
     *                 ),
     *                 @OA\Property(
     *                     property="expiry_date",
     *                     type="string",
     *                     example="2024-05-27 18:58:06"
     *                 ),
     *                 @OA\Property(
     *                     property="note",
     *                     type="string",
     *                     example="Please make a bank transfer to ICT FLW"
     *                 ),
     *                 @OA\Property(
     *                     property="amount",
     *                     type="string",
     *                     example="48625.00"
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Unauthenticated."
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="This action is unauthorized."
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Payment not found",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Payment not found"
     *             )
     *         )
     *     ),
     
     * )
     */
    public function generateAccount($id)
    {
        $generateAccount = $this->paymentService->createAccountNumber($id);
        $getProperty = $this->propertyService->getProperty($id);
        return response()->json(["status" => "success", "data" => $generateAccount, "property" => $getProperty], 200);
    }

    public function webhook(Request $request)
    {
        Log::error('I came at webhook on ' . Carbon::now(), ['data' => $request->all()]);
        DB::beginTransaction();
        try {
            if ($request->has('status') && $request->status == "successful") {
                // get account 
                $getAccount = $this->paymentService->getAccountNumberByTxRef($request->txRef);
                if ($getAccount) {
                    // save Payment
                    $paymentData = [
                        "tx_ref" => $request->txRef,
                        "flw_ref" => $request->flwRef,
                        "demand_notice_id" => $getAccount->demand_notice_id,
                        "actual_amount" => $request->amount,
                        "charged_amount" => $request->charged_amount,
                        "app_fee" => $request->appfee,
                        "merchant_fee" => $request->merchantfee,
                        "status" => Payment::STATUS_COMPLETED,
                        "webhook_string" => json_encode($request->all()),
                    ];
                    $payment = $this->paymentService->createPayment($paymentData);
                    // update demand notice status
                    if ($payment) {
                        $this->demandNoticeService->updateDemandNotice($getAccount->demand_notice_id, ["status" => DemandNotice::PAID]);
                        //return response()->json(["status" => "success", "data" => $request->all(), "message" => "Payment received"], 200);
                    }
                }
                DB::commit();
                return response()->json(["status" => "success", "data" => "", "message" => "Payment received"], 200);
            }
            Log::error('Failed to update payment data', ['error' => "No status key or status not successful"]);
            return response()->json(["status" => "error", "data" => "", "message" => "Payment not saved"], 400);
        } catch (\Exception $e) {
            DB::rollBack();

            // Log the error or handle it accordingly
            Log::error('Failed to update payment data', ['error' => $e->getMessage()]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update payment',
            ], 400);
        }
    }

    /**
     * Handle transaction validation.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */

    public function validateTransaction(Request $request)
    {
        // Retrieve and decrypt payload
        $encryptedPayload = $request->header("HASH");
        $decryptedPayload = $this->decryptPayload($encryptedPayload);

        $getProperty = $this->getDemandNoticeWithPropertyPid($decryptedPayload["Params"]["Occupier"]);
        if (!$getProperty) {
            $response = [
                "Message" => "provided product number is wrong",
                "Amount"  => 0,
                "HasError" => true,
                "Params" => [],
                "ErrorMessages" => ["provided product number is wrong"]
            ];
        }

        $getDemandNotice = $getProperty->demandNotices()->latest()->first();
        if (!$getDemandNotice) {
            $response = [
                "Message" => "provided product number is wrong",
                "Amount"  => 0,
                "HasError" => true,
                "Params" => [],
                "ErrorMessages" => ["provided product number is wrong"]
            ];
            return response($this->encryptResponse($response), 200);
        }
        $propertyDetails = [
            "ProductID" => $getProperty->pid,
            "Amount" => $getDemandNotice->amount,
            "Address" => $getDemandNotice->prop_addr,
            "Street" => $getProperty->street ?? $getProperty->street->name,
            "CadastralZone" => $getProperty->cadastralZone ?? $getProperty->cadastralZone->name,
            "RatingDistrict" => $getProperty->ratingDistrict ?? $getProperty->ratingDistrict->name,
        ];
        if ($getDemandNotice->status == DemandNotice::PAID) {
            $response = [
                "Message" => "Sorry Payment has been  processed before.",
                "Amount"  => 0,
                "HasError" => true,
                "Params" => [],
                "ErrorMessages" => ["Sorry Payment has been  processed before."]
            ];
            return response($this->encryptResponse($response), 200);
        }

        if ($decryptedPayload["Amount"] != 0.0) {

            $response = [
                "Message" => "amount should be 0.0",
                "Amount"  => $getDemandNotice->amount,
                "HasError" => true,
                "Params" => [],
                "ErrorMessages" => ["amount should be 0.0"]
            ];
            return response($this->encryptResponse($response), 200);
        }

        $returnedParams = $propertyDetails; //array_merge($decryptedPayload["Params"], $propertyDetails);
        $response = [
            "Message" => "Transaction validated successfully.",
            "Amount"  => $getDemandNotice->amount,
            "HasError" => false,
            "Params" => $returnedParams,
            "ErrorMessages" => []
        ];
        //$getProperty
        return response($this->encryptResponse($response), 200);
    }

    /**
     * Handle transaction notification.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function notifyTransaction(Request $request)
    {
        // Retrieve and decrypt payload
        $encryptedPayload = $request->header("HASH");
        $decryptedPayload = $this->decryptPayload($encryptedPayload);
        $getDemandNotice = $this->getDemandNoticeWithPropertyPid($decryptedPayload["Params"]["Occupier"]);
        if (!$getDemandNotice) {
            $response = [
                "Message" => "could not save payment, wrong ProductID",
                "HasError" => true,
                "ErrorMessages" => ["could not save payment, wrong ProductID"]
            ];

            return response($this->encryptResponse($response), 200);
        }
        // create a new payment for the above demand notice 
        $paymentData = [
            "tx_ref" => $decryptedPayload["SessionId"],
            "flw_ref" => $decryptedPayload["SessionId"],
            "demand_notice_id" => $getDemandNotice->id,
            "actual_amount" => $decryptedPayload["Amount"],
            "charged_amount" => ($decryptedPayload["Amount"] * 1) / 100,
            "app_fee" => ($decryptedPayload["Amount"] * 0.5) / 100,
            "merchant_fee" => ($decryptedPayload["Amount"] * 0.5) / 100,
            "status" => Payment::STATUS_COMPLETED,
            "webhook_string" => json_encode($decryptedPayload),
        ];
        $payment = $this->paymentService->createPayment($paymentData);
        if (!$payment) {
            $response = [
                "Message" => "could not save payment",
                "HasError" => true,
                "ErrorMessages" => ["could not save payment"]
            ];

            return response($this->encryptResponse($response), 200);
        }
        $this->demandNoticeService->updateDemandNotice($getDemandNotice->id, ["status" => DemandNotice::PAID]);
        $response = [
            "Message" => "Transaction Completed",
            "HasError" => false,
            "ErrorMessages" => []
        ];

        return response($this->encryptResponse($response), 200);
    }

    public function resetKeys(Request $request)
    {
        // Generate new IV and SECRET KEY
        $newIv = $this->generateKey(); // 16 characters (8 bytes) for AES-128-CBC
        $newSecret = $this->generateKey(); // 16 characters (8 bytes) for AES-128-CBC

        // Save the new keys 
        $this->paymentService->createOrUpdateNibssKey(["key_name" => "AES_IV", "key" => $newIv]);
        $this->paymentService->createOrUpdateNibssKey(["key_name" => "SECRET_KEY", "key" => $newSecret]);
        // Send the new keys to the specified email
        Mail::to(env("NIBSS_EMAIL"))->send(new \App\Mail\ResetKeysMail($newIv, $newSecret));

        return response()->json([
            'status' => 'success',
            'message' => 'IV and SECRET KEY have been reset and sent to NIBSS.',
        ], 200);
    }

    /**
     * Encrypt response data.
     *
     * @param array $data
     * @return string
     */
    private function encryptResponse(array $data)
    {
        $iv = $this->paymentService->getNibssKey("AES_IV")->key;
        $secretKey = $this->paymentService->getNibssKey("SECRET_KEY")->key;
        $encryptedData = openssl_encrypt(json_encode($data), 'AES-128-CBC', $secretKey, OPENSSL_RAW_DATA, $iv);
        return bin2hex($encryptedData);
    }

    /**
     * Decrypt request payload.
     *
     * @param string $payload
     * @return array
     */
    private function decryptPayload($payload)
    {
        $iv = $this->paymentService->getNibssKey("AES_IV")->key;
        $secretKey = $this->paymentService->getNibssKey("SECRET_KEY")->key;

        $decryptedData = openssl_decrypt(hex2bin($payload), 'AES-128-CBC', $secretKey, OPENSSL_RAW_DATA, $iv);
        return json_decode($decryptedData, true);
    }


    private function getDemandNoticeWithPropertyPid($propertyId)
    {
        $getProperty = (new PropertyService())->getProperty($propertyId);
        if (!$getProperty) {
            return false;
        }
        $getDemandNotice = $getProperty->demandNotices()->latest()->first();
        return $getProperty;
    }

    public function generateKey()
    {
        return bin2hex(random_bytes(8));
        //return bin2hex(openssl_random_pseudo_bytes(16));
    }
}
