<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;


/**
 * @OA\Schema(
 *     title="ShowPropertyResource",
 *     description="Show property resource",
 *     @OA\Property(
 *         property="id",
 *         type="integer",
 *         description="Property ID"
 *     ),
 *     @OA\Property(
 *         property="pid",
 *         type="string",
 *         description="Property PID"
 *     ),
 *     @OA\Property(
 *         property="occupant",
 *         type="string",
 *         description="Property occupant"
 *     ),
 *     @OA\Property(
 *         property="prop_addr",
 *         type="string",
 *         description="Property address"
 *     ),
 *     @OA\Property(
 *         property="street_name",
 *         type="string",
 *         description="Street name"
 *     ),
 *     @OA\Property(
 *         property="asset_no",
 *         type="string",
 *         description="Asset number"
 *     ),
 *     @OA\Property(
 *         property="cadastral_zone",
 *         type="string",
 *         description="Cadastral zone"
 *     ),
 *     @OA\Property(
 *         property="prop_type",
 *         type="string",
 *         description="Property type"
 *     ),
 *     @OA\Property(
 *         property="prop_use",
 *         type="string",
 *         description="Property use"
 *     ),
 *     @OA\Property(
 *         property="rating_dist",
 *         type="string",
 *         description="Rating district"
 *     ),
 *     @OA\Property(
 *         property="annual_value",
 *         type="number",
 *         format="float",
 *         description="Annual value"
 *     ),
 *     @OA\Property(
 *         property="rate_payable",
 *         type="number",
 *         format="float",
 *         description="Rate payable"
 *     ),
 *     @OA\Property(
 *         property="grand_total",
 *         type="number",
 *         format="float",
 *         description="Grand total"
 *     ),
 *     @OA\Property(
 *         property="category",
 *         type="string",
 *         description="Category"
 *     ),
 *     @OA\Property(
 *         property="group",
 *         type="string",
 *         description="Group"
 *     ),
 *     @OA\Property(
 *         property="active",
 *         type="boolean",
 *         description="Active status"
 *     ),
 *     @OA\Property(
 *         property="demand_notice",
 *         type="array",
 *         description="Demand notices",
 *         @OA\Items(ref="#/components/schemas/PropertyDemandNoticeResource")
 *     ),
 *     @OA\Property(
 *         property="status",
 *         type="string",
 *         description="Status"
 *     )
 * )
 */

/**
 * @OA\Schema(
 *     title="PropertyDemandNoticeResource",
 *     description="Resource representing a demand notice",
 *     @OA\Property(
 *         property="id",
 *         type="integer",
 *         description="The ID of the demand notice"
 *     ),
 *    
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
 *         ref="#/components/schemas/ShowPropertyResource"
 *     ),
 *     @OA\Property(
 *         property="date_created",
 *         type="string",
 *         format="date-time",
 *         description="The date when the demand notice was created"
 *     )
 * )
 */
class ShowPropertyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'pid' => $this->pid,
            'occupant' => $this->prop_addr,
            'prop_addr' => $this->prop_addr,
            'street_name' => $this->street_name,
            'asset_no' => $this->asset_no,
            'cadastral_zone' => $this->cadastral_zone,
            'prop_type' => $this->prop_type,
            'prop_use' => $this->prop_use,
            'rating_dist' => $this->rating_dist,
            'annual_value' => $this->annual_value,
            'rate_payable' => $this->rate_payable,
            //'arrears' => $this->arrears,
            //'penalty' => $this->penalty,
            'grand_total' => $this->grand_total,
            'category' => $this->category,
            'group' => $this->group,
            'active' => $this->active,
            'demand_notice' => DemandNoticeResource::collection($this->demandNotices),
            "status" => "success"
        ];
    }
}
