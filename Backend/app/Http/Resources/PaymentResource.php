<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *     title="PaymentResource",
 *     description="Payment resource",
 *     @OA\Property(
 *         property="tx_ref",
 *         type="string",
 *         description="Transaction reference"
 *     ),
 *     @OA\Property(
 *         property="pin",
 *         type="string",
 *         description="Flutterwave reference"
 *     ),
 *     @OA\Property(
 *         property="demand_notice",
 *         type="object",
 *         description="Demand notice resource",
 *         @OA\Property(ref="#/components/schemas/DemandNoticeResource")
 *     ),
 *     @OA\Property(
 *         property="actual_amount",
 *         type="number",
 *         format="float",
 *         description="Actual amount"
 *     ),
 *     @OA\Property(
 *         property="charged_amount",
 *         type="number",
 *         format="float",
 *         description="Charged amount"
 *     ),
 *     @OA\Property(
 *         property="app_fee",
 *         type="number",
 *         format="float",
 *         description="Application fee"
 *     ),
 *     @OA\Property(
 *         property="merchant_fee",
 *         type="number",
 *         format="float",
 *         description="Merchant fee"
 *     ),
 *     @OA\Property(
 *         property="status",
 *         type="string",
 *         description="Payment status"
 *     )
 * )
 */
class PaymentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "tx_ref" => $this->tx_ref,
            "pin" => $this->flw_ref,
            "demand_notice" => new DemandNoticeResource($this->demandNotice),
            "actual_amount" => $this->actual_amount,
            "charged_amount" => $this->charged_amount,
            "app_fee" => $this->app_fee,
            "merchant_fee" => $this->merchant_fee,
            "status" => $this->status,
        ];
    }
}
