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
 *     example={
 *         "pid": 3176683,
 *         "prop_addr": "540 Kaci Extensions Suite 724 Francoborough, MS 22188",
 *         "street_name": "46329 McDermott Courts Apt. 058",
 *         "asset_no": "AMC/B14/TR/9",
 *         "cadastral_zone": "30769-6233",
 *         "prop_type": "SPLITTED",
 *         "prop_use": "COMMERCIAL",
 *         "rating_dist": "APO",
 *         "annual_value": 200000,
 *         "rate_payable": 45000,
 *         "arrears": 25000,
 *         "penalty": 45000,
 *         "grand_total": 4500000,
 *         "category": "RESIDENTIAL",
 *         "group": "AMAC2",
 *         "active": "ACTIVE",
 *         "created_at": "2024-05-06T11:54:58.000000Z",
 *         "updated_at": "2024-05-06T11:54:58.000000Z",
 *     }
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
