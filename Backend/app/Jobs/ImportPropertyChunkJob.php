<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ImportPropertyChunkJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $data;
    private $for;
    /**
     * Create a new job instance.
     */
    public function __construct($for, $data)
    {
        $this->data = $data;
        $this->for = $for;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $request = ["extraction_type" => $this->for, "data" => $this->data->toArray(),];
        $this->processCsv($request);
    }
    private function processCsv($request)
    {

        $fileContents = $request["data"];
        // Parse CSV data
        $rows = $fileContents;
        $uniqRatingDistrictData = [];
        $uniqCadastralZoneData = [];
        $uniqStreetData = [];
        $uniqPropertyTypeData = [];
        $uniqPropertyUseData = [];
        $uniqCategoryData = [];
        $uniqGroupData = [];


        foreach ($rows as $row) {
            $data = $row;

            if ($request["extraction_type"] == "property") {
                $dispatchProperty = ["for" => "property", "data" => $data];
                CsvExtractorJob::dispatch($dispatchProperty);
            } else {

                // Check if column C (index 2) exists and is not empty
                if (isset($data[8]) && !empty($data[8])) {
                    $uniqRatingDistrictData[] = ["rating_district" => $data[8]];
                }
                if (isset($data[6]) && !empty($data[6])) {
                    $uniqPropertyTypeData[] = ["property_type" => $data[6]];
                }
                if (isset($data[7]) && !empty($data[7])) {
                    $uniqPropertyUseData[] = ["property_use" => $data[7]];
                }
                if (isset($data[14]) && !empty($data[14])) {
                    $uniqCategoryData[] = ["category" => $data[14]];
                }
                if (isset($data[15]) && !empty($data[15])) {
                    $uniqGroupData[] = ["group" => $data[15]];
                }

                if (isset($data[8]) && !empty($data[8]) && isset($data[5]) && !empty($data[5])) {
                    $uniqCadastralZoneData[] = ["rating_district" => $data[8], "cadastral_zone" => $data[5]];
                }
                if (isset($data[3]) && !empty($data[3]) && isset($data[5]) && !empty($data[5])) {
                    $uniqStreetData[] = ["street" => $data[3], "cadastral_zone" => $data[5]];
                }
            }
        }

        if ($request["extraction_type"] != "property") {
            // shuffle the array for unique rating district
            $uniqRatingDistrictData = array_column($uniqRatingDistrictData, 'rating_district');

            // Remove duplicate values
            $uniqRatingDistrictData = array_unique($uniqRatingDistrictData);

            // Sort the values alphabetically
            sort($uniqRatingDistrictData);

            // Reconstruct the array
            $uniqRatingDistrictData = array_map(function ($value) {
                return ["rating_district" => $value];
            }, $uniqRatingDistrictData);

            // shuffle the array for unique property type
            $uniqPropertyTypeData = array_column($uniqPropertyTypeData, 'property_type');

            // Remove duplicate values
            $uniqPropertyTypeData = array_unique($uniqPropertyTypeData);

            // Sort the values alphabetically
            sort($uniqPropertyTypeData);

            // Reconstruct the array
            $uniqPropertyTypeData = array_map(function ($value) {
                return ["property_type" => $value];
            }, $uniqPropertyTypeData);


            // shuffle the array for unique property use
            $uniqPropertyUseData = array_column($uniqPropertyUseData, 'property_use');

            // Remove duplicate values
            $uniqPropertyUseData  = array_unique($uniqPropertyUseData);

            // Sort the values alphabetically
            sort($uniqPropertyUseData);

            // Reconstruct the array
            $uniqPropertyUseData  = array_map(function ($value) {
                return ["property_use" => $value];
            }, $uniqPropertyUseData);


            // shuffle the array for unique category
            $uniqCategoryData = array_column($uniqCategoryData, 'category');

            // Remove duplicate values
            $uniqCategoryData  = array_unique($uniqCategoryData);

            // Sort the values alphabetically
            sort($uniqCategoryData);

            // Reconstruct the array
            $uniqCategoryData  = array_map(function ($value) {
                return ["category" => $value];
            }, $uniqCategoryData);


            // shuffle the array for group
            $uniqGroupData = array_column($uniqGroupData, 'group');

            // Remove duplicate values
            $uniqGroupData  = array_unique($uniqGroupData);

            // Sort the values alphabetically
            sort($uniqGroupData);

            // Reconstruct the array
            $uniqGroupData  = array_map(function ($value) {
                return ["group" => $value];
            }, $uniqGroupData);


            // shuffle the array for unique cadastral zone

            $uniqueCadastralZoneDataPairs = [];
            foreach ($uniqCadastralZoneData as $item) {
                $uniqueCadastralZoneDataPairs[$item['cadastral_zone']] = $item;
            }

            $uniqueCadastralZoneDataPairs = array_values($uniqueCadastralZoneDataPairs);
            usort($uniqueCadastralZoneDataPairs, function ($x, $y) {
                return strcmp($x['cadastral_zone'], $y['cadastral_zone']);
            });

            // shuffle the array for unique street

            $uniqueStreetDataPairs = [];
            foreach ($uniqStreetData as $item) {
                $uniqueStreetDataPairs[$item['street']] = $item;
            }

            $uniqueStreetDataPairs = array_values($uniqueStreetDataPairs);
            usort($uniqueStreetDataPairs, function ($x, $y) {
                return strcmp($x['street'], $y['street']);
            });

            $streetData = ["for" => "street", "data" => $uniqueStreetDataPairs];
            $cadastralZoneData = ["for" => "cadastral_zone", "data" => $uniqueCadastralZoneDataPairs];
            $ratingDistrictData = ["for" => "rating_district", "data" => $uniqRatingDistrictData];
            $propertyTypeData = ["for" => "property_type", "data" => $uniqPropertyTypeData];
            $propertyUseData = ["for" => "property_use", "data" => $uniqPropertyUseData];
            $categoryData = ["for" => "category", "data" => $uniqCategoryData];
            $groupData = ["for" => "group", "data" => $uniqGroupData];
            CsvExtractorJob::dispatch($ratingDistrictData);
            CsvExtractorJob::dispatch($cadastralZoneData);
            CsvExtractorJob::dispatch($streetData);
            CsvExtractorJob::dispatch($propertyTypeData);
            CsvExtractorJob::dispatch($propertyUseData);
            CsvExtractorJob::dispatch($categoryData);
            CsvExtractorJob::dispatch($groupData);
        }
    }
}
