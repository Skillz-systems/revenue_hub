<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Class ShowPropertyResource.
 *
 *
 * @OA\Schema(
 *     schema="ShowPropertyResource",
 *     type="object",
 *     title="Show Property Resource",
 *     description="Show Property Resource",
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
            "status" => "success"
        ];
    }
}
