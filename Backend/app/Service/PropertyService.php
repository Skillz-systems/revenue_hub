<?php

namespace App\Service;

use App\Models\Property;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PropertyService
{
    public function storeProperty($request)
    {
        $property = Property::create($request->all());
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
