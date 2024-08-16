<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;


/**
 * @OA\Schema(
 *     title="DemandNoticeResource",
 *     description="Resource representing a demand notice",
 *     @OA\Property(
 *         property="id",
 *         type="integer",
 *         description="The ID of the demand notice"
 *     ),
 *     @OA\Property(
 *         property="payments",
 *         type="array",
 *         description="all the payments associated with the demand notice",
 *         @OA\Items(ref="#/components/schemas/DemandNoticePaymentResource")
 *     ),
 * 
 *     @OA\Property(
 *         property="amount",
 *         type="string",
 *         description="The amount of the demand notice"
 *     ),
 *     @OA\Property(
 *         property="arrears_amount",
 *         type="string",
 *         description="The arrears amount of the demand notice"
 *     ),
 *     @OA\Property(
 *         property="penalty",
 *         type="string",
 *         description="The penalty of the demand notice"
 *     ),
 *     @OA\Property(
 *         property="status",
 *         type="integer",
 *         description="The status of the demand notice"
 *     ),
 *     @OA\Property(
 *         property="property",
 *         ref="#/components/schemas/PropertyResource"
 *     ),
 *     @OA\Property(
 *         property="date_created",
 *         type="string",
 *         format="date-time",
 *         description="The date when the demand notice was created"
 *     )
 *     @OA\Property(
 *         property="reminder_date",
 *         type="string",
 *         format="date-time",
 *         description="The date when the reminder was created"
 *     )
 * )
 */
class DemandNoticeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $property = new PropertyResource($this->property);
        $property->additional([
            'context' => 'without_demand_notice' // or any other status you want to append
        ]);
        return [
            "id" => $this->id,
            "amount" => $this->amount,
            "arrears_amount" => $this->arrears_amount,
            "penalty" => $this->penalty,
            "status" => $this->status,
            "property" => $property,
            "payments" => DemandNoticePaymentResource::collection($this->payments),
            "date_created" => $this->created_at,
            "reminder_date" => $this->reminder ? $this->reminder->created_at : null,
        ];
    }
}
