<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
/**
 * @OA\GET(
 *     path="/api/dashboard",
 *     operationId="getDashboardData",
 *     tags={"Dashboard"},
 *     summary="Get dashboard data",
 *     description="Returns various counts and sums from the database",
 *     security={{"api_key":{}}},
 *     @OA\Parameter(
 *         in="path",
 *         name="property",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Successful operation",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="total_amount", type="number", format="float", example=2,197,665,187),
 *             @OA\Property(property="total_properties", type="integer", example=500),
 *             @OA\Property(property="total_demand_notices", type="integer", example=385),
 *             @OA\Property(property="paid_demand_notice", type="integer", example=123),
 *             @OA\Property(property="pending_demand_notice", type="integer", example=122)
 *             @OA\Property(property="expired_demand_notice", type="integer", example=140)
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal Server Error",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="error", type="string", example="An error occurred while fetching the dashboard data."),
 *             @OA\Property(property="message", type="string", example="Error message details")
 *         )
 *     ),
 * )
 */

    public function getDashboardData()
    {
        try {
            $totalAmount = DB::table('demand_notices')
                ->select(DB::raw('SUM(CAST(amount AS SIGNED)) as total_amount'))
                ->value('total_amount');

            $totalProperties = DB::table('properties')->count();
            $totalDemandNotice = DB::table('demand_notices')->count();
            $paidDemandNotice = DB::table('demand_notices')
                ->where('status', 'paid')
                ->count();
            $pendingDemandNotice = DB::table('demand_notices')
                ->where('status', 'unpaid')
                ->count();
            $expiredDemandNotice =DB::table('demand_notices')
                ->where('status', 'expired')
                ->count();    

            return response()->json([
                'total_amount' => $totalAmount,
                'total_properties' => $totalProperties,
                'total_demand_notice' => $totalDemandNotice,
                'paid_demand_notice' => $paidDemandNotice,
                'pending_demand_notice' => $pendingDemandNotice,
                'expired_demand_notice' => $expiredDemandNotice,
            ]);

        } catch (\Exception $e) {
            
            return response()->json([
                'error' => 'An error occurred while fetching the dashboard data.',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
