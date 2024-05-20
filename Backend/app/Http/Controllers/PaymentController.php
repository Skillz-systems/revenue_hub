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

    public function index()
    {
        $service = $this->paymentService;
        $getPaginatedPayments = $service->allPayment();
        $payments = PaymentResource::collection($getPaginatedPayments);
        $payments->additional([
            'status' => 'success' // or any other status you want to append
        ]);
        return $payments;
    }

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

    public function generateAccount($id)
    {
        $generateAccount = $this->paymentService->createAccountNumber($id);
        return response()->json(["status" => "success", "data" => $generateAccount], 200);
    }
}
