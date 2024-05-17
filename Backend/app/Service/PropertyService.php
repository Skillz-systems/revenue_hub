<?php

namespace App\Service;

use App\Jobs\ProcessCsvUpload;
use App\Models\Property;

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



    public function uploadProperty($request)
    {
        // get the file original path
        $file = file($request->file->getRealPath());
        // remove the first line which is the header
        $data =  array_slice($file, 1);

        // split the data into new csv files after 5000 datas
        $parts = array_chunk($data, 5000);

        // loop through the files and add them into pending-files folder using the current dateTime as the name
        foreach ($parts as $index => $part) {
            $fileName = resource_path('pending-files/' . date('y-m-d-H-i-s') . $index . '.csv');
            file_put_contents($fileName, $part);
        }

        return true;
    }



    public function importToDb()
    {
        // get all files in the folder
        $path = resource_path('pending-files/*.csv');

        $files = glob($path);

        // get one file at a time and process it
        foreach ($files as $file) {
            //ProcessCsvUpload::dispatch($file);

            dump("Processing files" . $file);
            $data = array_map('str_getcsv', file($file));

            foreach ($data as $row) {
                // add to database

                dump($row[0]);
            }
        }


        return true;
    }
}
