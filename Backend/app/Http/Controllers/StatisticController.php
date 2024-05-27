<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Service\StaffService;
use App\Service\PaymentService;
use App\Service\PropertyService;
use App\Service\DemandNoticeService;

class StatisticController extends Controller
{
    private $staffService;
    private $propertyService;
    private $paymentService;
    private $demandNoticeService;

    public function __construct(StaffService $staffService, PropertyService $propertyService, PaymentService $paymentService, DemandNoticeService $demandNoticeService)
    {
        $this->staffService = $staffService;
        $this->propertyService = $propertyService;
        $this->paymentService = $paymentService;
        $this->demandNoticeService = $demandNoticeService;
    }

    /**
     * @OA\Post(
     *     path="/api/statistic/all-yearly-data",
     *     summary="Retrieve all yearly statistical  data",
     *     description="Returns various statistics and totals for a specific year, including total payments, demand notices, properties, and users.",
     *     tags={"statistics"},
     *     @OA\Parameter(
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
     *             @OA\Property(property="status", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="total_payments", type="integer", example=10),
     *                 @OA\Property(property="total_demand_notices", type="integer", example=20),
     *                 @OA\Property(property="total_paid_demand_notices", type="integer", example=15),
     *                 @OA\Property(property="total_pending_demand_notices", type="integer", example=5),
     *                 @OA\Property(property="total_demand_notices_amount", type="number", example=5000.50),
     *                 @OA\Property(property="total_properties", type="integer", example=100),
     *                 @OA\Property(property="total_users", type="integer", example=50)
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized: Missing or invalid token",
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error",
     *     ),
     *     security={{"bearerAuth": {}}}
     * )
     */

    public function allYearlyData(Request $request)
    {
        $defaultDate = date("Y");
        if ($request->date_filter) {
            $defaultDate = $request->date_filter;
        }
        $totalPayments = $this->paymentService->totalNumberOfPaymentByYear($defaultDate);
        $totalDemandNotices = $this->demandNoticeService->totalGeneratedDemandNoticeByYear($defaultDate);
        $totalPaidDemandNotices = $this->demandNoticeService->totalPaidDemandNoticeByYear($defaultDate);
        $totalPendingDemandNotices = $this->demandNoticeService->totalPendingDemandNoticeByYear($defaultDate);
        $totalDemandNoticesAmount = $this->demandNoticeService->demandNoticeYearAmountSum($defaultDate);
        $totalProperties = $this->propertyService->getTotalNumberOfProperties();
        $totalUsers = $this->staffService->getTotalNumberOfStaff();
        return response()->json([
            "status" => true,
            "data" => [
                "total_payments" => $totalPayments,
                "total_demand_notices" => $totalDemandNotices,
                "total_paid_demand_notices" => $totalPaidDemandNotices,
                "total_pending_demand_notices" => $totalPendingDemandNotices,
                "total_demand_notices_amount" => $totalDemandNoticesAmount,
                "total_properties" => $totalProperties,
                "total_users" => $totalUsers
            ]
        ]);
    }
}
