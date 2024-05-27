<?php

namespace App\Http\Controllers;

use App\Http\Resources\PaymentResource;
use App\Service\PaymentService;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    protected $paymentService;
    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
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
        return response()->json(["status" => "success", "data" => $generateAccount], 200);
    }
}
