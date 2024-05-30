<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *     schema="PropertyResource",
 *     type="object",
 *     title="Property Resource",
 *     description="A resource representing a property",
 *     @OA\Property(property="id", type="integer", example=1, description="The unique identifier of the property"),
 *     @OA\Property(property="pid", type="string", example="P12345", description="The property ID"),
 *     @OA\Property(property="occupant", type="string", example="John Doe", description="The occupant of the property"),
 *     @OA\Property(property="prop_addr", type="string", example="123 Main St", description="The property address"),
 *     @OA\Property(property="street_name", type="string", example="Main St", description="The street name"),
 *     @OA\Property(property="asset_no", type="string", example="A123", description="The asset number"),
 *     @OA\Property(property="cadastral_zone", type="string", example="Zone A", description="The cadastral zone"),
 *     @OA\Property(property="prop_type", type="string", example="Residential", description="The type of the property"),
 *     @OA\Property(property="prop_use", type="string", example="Owner-Occupied", description="The usage of the property"),
 *     @OA\Property(property="rating_dist", type="string", example="Dist 1", description="The rating district"),
 *     @OA\Property(property="annual_value", type="number", format="float", example=1200.50, description="The annual value of the property"),
 *     @OA\Property(property="rate_payable", type="number", format="float", example=300.75, description="The rate payable"),
 *     @OA\Property(property="grand_total", type="number", format="float", example=1500.25, description="The grand total"),
 *     @OA\Property(property="category", type="string", example="Category A", description="The category of the property"),
 *     @OA\Property(property="group", type="string", example="Group 1", description="The group of the property"),
 *     @OA\Property(property="active", type="boolean", example=true, description="The active status of the property"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2023-01-01T12:00:00Z", description="The creation timestamp of the property"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2023-01-02T12:00:00Z", description="The last update timestamp of the property"),
 *     @OA\Property(
 *         property="demand_notice",
 *         type="array",
 *         @OA\Items(ref="#/components/schemas/DemandNoticeResource"),
 *         description="A collection of demand notices associated with the property"
 *     ),
 *     @OA\Property(property="demand_notice_status", type="string", example="Paid", description="The status of the latest demand notice"),
 * )
 */
class PropertyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $latestDemandNotice = $this->demandNotices()->latest()->first();
        $demandNoticeStatus = "Ungenerated";
        if (!empty($latestDemandNotice)) {
            if (date('Y', strtotime($latestDemandNotice->created_at)) == date("Y")) {
                $demandNoticeStatus = $latestDemandNotice->status == 1 ? "Paid" : "Unpaid";
            }
        }

        $context = $this->additional['context'] ?? 'default';
        return [
            'id' => $this->id,
            'pid' => $this->pid,
            'occupant' => $this->occupant,
            'prop_addr' => $this->prop_addr,
            'street_name' => $this->street_name,
            'asset_no' => $this->asset_no,
            'cadastral_zone' => $this->cadastral_zone,
            'prop_type' => $this->prop_type,
            'prop_use' => $this->prop_use,
            'rating_dist' => $this->rating_dist,
            'annual_value' => $this->annual_value,
            'rate_payable' => $this->rate_payable,
            'grand_total' => $this->grand_total,
            'category' => $this->category,
            'group' => $this->group,
            'active' => $this->active,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            $this->mergeWhen($context == 'default', [
                'demand_notice' => DemandNoticeResource::collection($this->demandNotices),
            ]),
            "demand_notice_status" => $demandNoticeStatus,

        ];
    }
}
