<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Class StorePropertyResource.
 *
 *
 * @OA\Schema(
 *     schema="StorePropertyResource",
 *     type="object",
 *     title="Store Property Resource",
 *     description="Store Property Resource",
 * )
 */
class StorePropertyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'status' => "success",
            'message' => "Property added successfully",
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
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
