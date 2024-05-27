<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *     title="PaymentResource",
 *     description="The payment resource",
 *     @OA\Property(
 *         property="tx_ref",
 *         type="string",
 *         description="The transaction reference"
 *     ),
 *     @OA\Property(
 *         property="pin",
 *         type="string",
 *         description="The Flutterwave reference"
 *     ),
 * 
 *     @OA\Property(
 *         property="demand_notice",
 *         
 *         ref="#/components/schemas/DemandNoticeResource",
 *         description="The demand notice resource",
 *     ),
 *     @OA\Property(
 *         property="actual_amount",
 *         type="number",
 *         description="The actual amount"
 *     ),
 *     @OA\Property(
 *         property="charged_amount",
 *         type="number",
 *         description="The charged amount"
 *     ),
 *     @OA\Property(
 *         property="app_fee",
 *         type="number",
 *         description="The application fee"
 *     ),
 *     @OA\Property(
 *         property="merchant_fee",
 *         type="number",
 *         description="The merchant fee"
 *     ),
 *     @OA\Property(
 *         property="status",
 *         type="string",
 *         description="The payment status"
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
