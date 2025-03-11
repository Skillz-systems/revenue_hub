<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
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
 *     ),
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
        $colorStatus = $this->determineColorStatus();
        return [
            "id" => $this->id,
            "amount" => $this->amount,
            "arrears_amount" => number_format($this->arrears_amount - $this->penalty, 0, '.', ','),
            "penalty" => $this->penalty,
            "status" => $this->status,
            "color_status" => $colorStatus,
            "property" => $property,
            "office_zone" => $property->ratingDistrict->officeZone,
            "payments" => DemandNoticePaymentResource::collection($this->payments),
            "date_created" => $this->created_at,
            "reminder_date" => $this->reminder ? $this->reminder->created_at : null,
        ];
    }
    /**
     * Determine the color status based on the status and date logic.
     *
     * @return int
     */
    private function determineColorStatus(): int
    {
        if ($this->status == 1) {
            return 3;
        }

        $daysSinceCreated = Carbon::now()->diffInDays($this->created_at);
        if ($this->status == 0) {
            if ($daysSinceCreated <= 28) {
                return 0;
            }

            if ($this->reminder) {
                $daysSinceReminder = Carbon::now()->diffInDays($this->reminder->created_at);
                if ($daysSinceCreated > 28 && $daysSinceReminder <= 28) {
                    return 1;
                }
                if ($daysSinceReminder > 28) {
                    return 4;
                }
            } else {
                return 2;
            }
        }
        return -1;
    }
}
