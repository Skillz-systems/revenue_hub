<?php

namespace App\Service;

use App\Models\Property;

class PropertyService
{
    public function storeProperty($request)
    {
        $property = Property::create([
            'status' => "success",
            'message' => "Property added successfully",
            'pid' => $request->pid,
            'prop_addr' => $request->prop_addr,
            'street_name' => $request->street_name,
            'asset_no' => $request->asset_no,
            'cadastral_zone' => $request->cadastral_zone,
            'prop_type' => $request->prop_type,
            'prop_use' => $request->prop_use,
            'rating_dist' => $request->rating_dist,
            'annual_value' => $request->annual_value,
            'rate_payable' => $request->rate_payable,
            'arrears' => $request->arrears,
            'penalty' => $request->penalty,
            'grand_total' => $request->grand_total,
            'category' => $request->category,
            'group' => $request->group,
            'active' => $request->active,
        ]);
        return $property;
    }
}
