<?php

namespace App\Service;

use App\Models\Property;

class PropertyService
{
    public function storeProperty($request)
    {
        $property = Property::create([
            'pid' => $request->pid,
            'occupant' => $request->occupant,
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

    public function updateProperty($request, $property)
    {
        $updateProperty = Property::where('pid', $property->pid)->first();

        if ($updateProperty) {
            $updateProperty->update([
                'pid' => $property->pid,
                'occupant' => $request->occupant,
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

            return $updateProperty;
        }

        return false;
    }



    public function uploadProperty($request)
    {
        // get the file original path
        $file = ($request->file->getRealPath());
        // get the content of the files
        $csvData = file_get_contents($file);
        // create an array of each line 
        $rows = array_map("str_getcsv", explode("\n", $csvData));
        // remove the first line which is the header
        $rowsData =  array_slice($rows, 1);


        //dd($rowsData[0][0]);

        foreach ($rowsData as $data) {

            Property::create([
                'pid' => $data[0],
                'occupant' => $data[1],
                'prop_addr' => $data[2],
                'street_name' => $data[3],
                'asset_no' => $data[4],
                'cadastral_zone' => $data[5],
                'prop_type' => $data[6],
                'prop_use' => $data[7],
                'rating_dist' => $data[8],
                'annual_value' => $data[9],
                'rate_payable' => $data[10],
                'arrears' => $data[11],
                'penalty' => $data[12],
                'grand_total' => $data[13],
                'category' => $data[14],
                'group' => $data[15],
                'active' => $data[16],
            ]);
        }

        return true;
    }
}
