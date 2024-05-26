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
            'occupant' => $request->prop_addr,
            'prop_addr' => $request->prop_addr,
            'street_name' => $request->street_name,
            'asset_no' => $request->asset_no,
            'cadastral_zone' => $request->cadastral_zone,
            'prop_type' => $request->prop_type,
            'prop_use' => $request->prop_use,
            'rating_dist' => $request->rating_dist,
            'annual_value' => $request->annual_value,
            'rate_payable' => $request->rate_payable,
            //'arrears' => $request->arrears,
            //'penalty' => $request->penalty,
            'grand_total' => $request->grand_total,
            'category' => $request->category,
            'group' => $request->group,
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

    public function getAllProperties()
    {
        return Property::all();
    }
}
