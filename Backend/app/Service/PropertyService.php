<?php

namespace App\Service;

use App\Models\Property;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PropertyService
{
    public function storeProperty($request)
    {
        $property = Property::create([

            'pid' => $request->pid,
            'occupant' => $request->occupant,
            'prop_addr' => $request->prop_addr,
            'street_id' => $request->street_name,
            'asset_no' => $request->asset_no,
            'cadastral_zone_id' => $request->cadastral_zone,
            'property_type_id' => $request->prop_type,
            'property_use_id' => $request->prop_use,
            'rating_district_id' => $request->rating_dist,
            'annual_value' => $request->annual_value,
            'rate_payable' => $request->rate_payable,
            'grand_total' => $request->grand_total,
            'category_id' => $request->category,
            'group_id' => $request->group,
            'active' => $request->active,
        ]);
        return $property;
    }

    public function updateProperty($request, $property)
    {

        if ($property) {

            if ($property->update($request->all())) {
                return $property;
            }

            return false;
        }

        return false;
    }

    public function getProperty($id)
    {
        return Property::where(["pid" => $id])->first();
    }

    public function getPropertyById($id)
    {
        try {
            return Property::findOrFail($id);;
        } catch (ModelNotFoundException) {

            return false;
        }
    }

    public function getTotalNumberOfProperties()
    {
        return Property::count();
    }

    public function searchProperty($request)
    {
        return Property::where('pid', $request->pid)->first();
    }

    public function getAllProperties($zone)
    {
        //return Property::where(["status" => Property::STATUS_Regular])->all();
        return Property::whereHas('ratingDistrict', function ($query) use ($zone) {
            $query->where('zone_id', $zone);
        })->paginate(100);
    }
}
