<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;
use App\Service\PropertyService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\PropertyResource;
use App\Jobs\CsvExtractorJob;
use App\Jobs\ProcessCSVFileInBatchJob;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use DB;

class PropertyController extends Controller
{
    private $propertyService;
    public function __construct(PropertyService $propertyService)
    {
        $this->propertyService = $propertyService;
    }
    /**
     * @OA\Post(
     *     path="/api/property",
     *     summary="Get all properties",
     *     tags={"Property"},
     *     security={{"api_key":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/PropertyResource")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No properties found",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="status",
     *                 type="string",
     *                 description="Status"
     *             ),
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 description="Message"
     *             )
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 100);
        $search = $request->input('search');
    
        $query = $this ->getAllWithFilters($request->all(), $perPage);
        

        if (Auth::user()->role_id != User::ROLE_ADMIN) {
            $properties = $query;
        } else {
            $properties = $query;
            //$properties = $this->propertyService->getAllProperties(Auth::user()->zone);
        }
        
        if ($properties->isNotEmpty()) {

            $returnProperty = PropertyResource::collection($properties);
            $returnProperty->additional([
                'status' => 'success', // or any other status you want to append
            ]);
            return  $returnProperty;
        }

        return response()->json([
            "status" => "error",
            "message" => "No properties found",
        ], 404);
    }

    /**
     * Add new property details.
     * @OA\POST(
     *     path="/api/property/create",
     *     tags={"Property"},
     *     summary="Add New Property Details",
     *     description="This allow staff admin to add new property details",
     *     operationId="addProperty",
     *     security={{"api_key":{}}},
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 @OA\Property(
     *                      type="object",
     *                      @OA\Property( property="pid", type="integer" ),
     *                      @OA\Property( property="prop_addr", type="string" ),
     *                      @OA\Property( property="street_name", type="string" ),
     *                      @OA\Property( property="asset_no", type="string" ),
     *                      @OA\Property( property="cadastral_zone", type="string" ),
     *                      @OA\Property( property="prop_type", type="string" ),
     *                      @OA\Property( property="prop_use", type="string" ),
     *                      @OA\Property( property="rating_dist", type="string" ),
     *                      @OA\Property( property="annual_value", type="string" ),
     *                      @OA\Property( property="rate_payable", type="integer" ),
     *                      @OA\Property( property="arrears", type="integer" ),
     *                      @OA\Property( property="penalty", type="integer" ),
     *                      @OA\Property( property="grand_total", type="integer" ),
     *                      @OA\Property( property="category", type="string" ),
     *                      @OA\Property( property="group", type="string" ),
     *                      @OA\Property( property="active", type="string" ),
     *                     
     *                 ),
     *                 example={
     *                     "pid":"integer",
     *                     "prop_addr":"string",
     *                     "street_name":"string",
     *                     "asset_no":"string",
     *                     "cadastral_zone":"string",
     *                     "prop_type":"string",
     *                     "prop_use":"string",
     *                     "rating_dist":"string",
     *                     "annual_value":"integer",
     *                     "rate_payable":"integer",
     *                     "grand_total":"integer",
     *                     "category":"string",
     *                     "group":"string",
     *                     "active":"string"
     *                }
     *             )
     *         )
     *      ),
     *     @OA\Response(
     *         response="200",
     *         description="Property added successfully",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/PropertyResource")
     *         ),
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Property added successfully"),
     *             @OA\Property(property="data", type="object",
     *                  @OA\Property(property="pid", type="string", example="12354654"),
     *                  @OA\Property(property="prop_addr", type="string", example="21 akidewa house 4"),
     *                  @OA\Property(property="street_name", type="string", example="4553532"),
     *                  @OA\Property(property="asset_no", type="string", example="566664565646"),
     *                  @OA\Property(property="cadastral_zone", type="string", example="2"),
     *                  @OA\Property(property="prop_type", type="string", example="residential"),
     *                  @OA\Property(property="prop_use", type="string", example="school"),
     *                  @OA\Property(property="rating_dist", type="string", example="oko"),
     *                  @OA\Property(property="annual_value", type="string", example="233165498"),
     *                  @OA\Property(property="rate_payable", type="string", example="89789"),
     *                  @OA\Property(property="grand_total", type="string", example="56456"),
     *                  @OA\Property(property="category", type="string", example="school"),
     *                  @OA\Property(property="group", type="string", example="commercial"),
     *                  @OA\Property(property="active", type="string", example="active"),
     *                  @OA\Property(property="created_at", type="string", format="date-time", example="2024-05-06T11:54:58.000000Z"),
     *                  @OA\Property(property="updated_at", type="string", format="date-time", example="2024-05-06T11:54:58.000000Z"),
     *             ),
     *        ),
     *     ),
     *     @OA\Response(
     *         response="400",
     *         description="All Fields are Required",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="All Fields are required"),
     *             @OA\Property(property="data", type="object",
     *             ),
     *         )
     *     ),
     *     @OA\Response(
     *         response="401",
     *         description="An error occured",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="An error occured"),
     *         )
     *     ),
     *
     * )
     *
     *
     *
     *
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pid' => ['required', 'string', 'unique:properties'],
            'occupant' => ['required', 'string', 'max:255'],
            'prop_addr' => ['required', 'string', 'max:255'],
            'street_name' => ['required', 'string', 'max:255'],
            'asset_no' => ['required', 'string', 'max:255'],
            'cadastral_zone' => ['required', 'string', 'max:255'],
            'prop_type' => ['required', 'string', 'max:255'],
            'prop_use' => ['required', 'string', 'max:255'],
            'rating_dist' => ['required', 'string', 'max:255'],
            'annual_value' => ['required', 'string'],
            'rate_payable' => ['required', 'string'],
            'grand_total' => ['required', 'string'],
            'category' => ['required', 'string', 'max:255'],
            'group' => ['required', 'string', 'max:255'],
            'active' => ['required', 'string', 'max:255'],
        ]);


        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => "All fields are required ",
                "data" => $validator->errors()
            ], 400);
        }

        $addProperty = (new PropertyService)->storeProperty($request);
        if ($addProperty) {
            $returnProperty = new PropertyResource($addProperty);
            $returnProperty->additional([
                'status' => 'success', // or any other status you want to append
                'context' => 'store'
            ]);
            return  $returnProperty;
        }

        return response()->json([
            "status" => "error",
            "message" => "An error occured",
        ], 401);
    }

    /**
     * Show  Property
     * @OA\GET (
     *     path="/api/property/{property}",
     *     tags={"Property"},
     *     summary="Get a property",
     *     description="Show details of a property",
     *     operationId="getProperty",
     *     security={{"api_key":{}}},
     *     @OA\Parameter(
     *         in="path",
     *         name="property",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Show details of a property",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/PropertyResource")
     *         ),
     *     ),
     *     @OA\Response(
     *         response="404",
     *         description="Not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="No Property found"),
     *         )
     *     ),
     * )
     */
    public function show($property)
    {
        $getProperty = $this->propertyService->getPropertyById($property);
        if ($getProperty) {
            $returnProperty = new PropertyResource($getProperty);
            $returnProperty->additional([
                'status' => 'success', // or any other status you want to append
            ]);
            return  $returnProperty;
        }

        return response()->json([
            "status" => "error",
            "message" => "No Property Found",
        ], 404);
    }

    /**
     * @OA\PUT(
     *     path="/api/property/{property}",
     *     tags={"Property"},
     *     summary="Update Property Details",
     *     description="This allow staff admin to update property details",
     *     operationId="updateProperty",
     *     security={{"api_key":{}}},
     *     @OA\Parameter(
     *         in="path",
     *         name="property",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ), 
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 @OA\Property(
     *                      type="object",
     *                      @OA\Property( property="prop_addr", type="string"),
     *                      @OA\Property( property="street_name",type="string"),
     *                      @OA\Property( property="asset_no",type="string"),
     *                      @OA\Property( property="cadastral_zone", type="string"),
     *                      @OA\Property( property="prop_type", type="string"),
     *                      @OA\Property( property="prop_use", type="string"),
     *                      @OA\Property( property="rating_dist", type="string"),
     *                      @OA\Property( property="annual_value", type="string"),
     *                      @OA\Property( property="rate_payable", type="integer" ),
     *                      @OA\Property( property="grand_total", type="integer" ),
     *                      @OA\Property( property="category", type="string" ),
     *                      @OA\Property( property="group", type="string" ),
     *                      @OA\Property( property="active", type="string"),
     *                 ),
     *                 example={
     *                     "prop_addr":"string",
     *                     "street_name":"string",
     *                     "asset_no":"string",
     *                     "cadastral_zone":"string",
     *                     "prop_type":"string",
     *                     "prop_use":"string",
     *                     "rating_dist":"string",
     *                     "annual_value":"integer",
     *                     "rate_payable":"integer",
     *                     "grand_total":"integer",
     *                     "category":"string",
     *                     "group":"string",
     *                     "active":"string"
     *                }
     *             )
     *         )
     *      ),
     *     @OA\Response(
     *         response="200",
     *         description="Property Updated Successfully",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/PropertyResource")
     *         ),
     *     ),
     *     @OA\Response(
     *         response="400",
     *         description="All Fields are Required",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="All Fields are required"),
     *             @OA\Property(property="data", type="object",
     *             ),
     *         )
     *     ),
     *     @OA\Response(
     *         response="401",
     *         description="An error occured",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="An error occured"),
     *         )
     *     ),
     *
     * )
     *
     *
     *
     *
     */
    public function update(Request $request, Property $property)
    {

        $validator = Validator::make($request->all(), [
            'occupant' => ['sometimes', 'string', 'max:255'],
            'prop_addr' => ['sometimes', 'string', 'max:255'],
            'street_name' => ['sometimes', 'string', 'max:255'],
            'asset_no' => ['sometimes', 'string', 'max:255'],
            'cadastral_zone' => ['sometimes', 'string', 'max:255'],
            'prop_type' => ['sometimes', 'string', 'max:255'],
            'prop_use' => ['sometimes', 'string', 'max:255'],
            'rating_dist' => ['sometimes', 'string', 'max:255'],
            'annual_value' => ['sometimes', 'string'],
            'rate_payable' => ['sometimes', 'string'],
            //'arrears' => ['required', 'integer'],
            //'penalty' => ['required', 'integer'],
            'grand_total' => ['sometimes', 'string'],
            'category' => ['sometimes', 'string', 'max:255'],
            'group' => ['sometimes', 'string', 'max:255'],
            'active' => ['sometimes', 'string', 'max:255'],
        ]);


        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => "All fields are required ",
                "data" => $validator->errors()
            ], 400);
        }

        $updateProperty = (new PropertyService)->updateProperty($request, $property);
        if ($updateProperty) {
            return response()->json([
                "status" => "success",
                "message" => "Updated property successfully",
            ], 200);
        }

        return response()->json([
            "status" => "error",
            "message" => "An error occured",
        ], 401);
    }


    /**
     * Delete Property
     * @OA\Delete (
     *     path="/api/property/{property}",
     *     tags={"Property"},
     *     summary="Delete a property",
     *     description="This allow staff admin to delete property",
     *     operationId="deleteProperty",
     *     security={{"api_key":{}}},
     *     @OA\Parameter(
     *         in="path",
     *         name="property",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Property deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Property deleted successfully"),
     *         )
     *     ),
     *     @OA\Response(
     *         response="401",
     *         description="You dont Have Permission",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="You dont Have Permission"),
     *         )
     *     ),
     *     @OA\Response(
     *         response="402",
     *         description="An error occured",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="An error occured"),
     *         )
     *     ),
     * )
     */

    public function destroy(Property $property)
    {

        if (Auth::user()->role_id == User::ROLE_ADMIN) {

            if ($property->delete()) {
                return response()->json([
                    "status" => "success",
                    "message" => "Property deleted successfully",
                ], 200);
            }

            return response()->json([
                "status" => "error",
                "message" => "An error occured",
            ], 402);
        }

        return response()->json([
            "status" => "error",
            "message" => "You dont Have Permission",
        ], 401);
    }

    public function processCsv($request)
    {

        $fileContents = Storage::get($request["file_path"]);
        // Parse CSV data
        $rows = explode("\n", $fileContents);
        $uniqRatingDistrictData = [];
        $uniqCadastralZoneData = [];
        $uniqStreetData = [];
        $uniqPropertyTypeData = [];
        $uniqPropertyUseData = [];
        $uniqCategoryData = [];
        $uniqGroupData = [];


        foreach ($rows as $row) {
            $data = str_getcsv($row);

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

    public function chunkUpload(Request $request)
    {
        $validator = validator::make($request->all(), [
            'file' => 'required|file',
            'chunk_number' => 'required|integer',
            'total_chunks' => 'required|integer',
            'file_name' => 'required|string',
        ]);


        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => "All fields are required ",
                "data" => $validator->errors()
            ], 400);
        }


        // Directory to store chunks
        $chunkDir = storage_path('app/chunks/' . $request->file_name);

        // Create directory if not exists
        if (!is_dir($chunkDir)) {
            mkdir($chunkDir, 0777, true);
        }

        // Save the uploaded chunk
        $file = $request->file('file');
        $file->move($chunkDir, 'chunk_' . $request->chunk_number);

        // Check if all chunks are uploaded
        $allChunksUploaded = true;
        for ($i = 1; $i <= $request->total_chunks; $i++) {
            if (!file_exists($chunkDir . '/chunk_' . $i)) {
                $allChunksUploaded = false;
                break;
            }
        }

        // Combine chunks if all are uploaded
        if ($allChunksUploaded) {
            $finalPath = storage_path('app/uploads/' . $request->file_name);

            // Create a file pointer
            $dir = storage_path('app/uploads');
            if (!is_dir($dir)) {
                mkdir($dir, 0777, true);
            }
            $output = fopen($finalPath, 'wb');
            for ($i = 1; $i <= $request->total_chunks; $i++) {
                $chunkPath = $chunkDir . '/chunk_' . $i;
                $input = fopen($chunkPath, 'rb');
                stream_copy_to_stream($input, $output);
                fclose($input);
                // Optionally delete the chunk file
                unlink($chunkPath);
            }
            fclose($output);
            // Optionally delete the chunk directory
            rmdir($chunkDir);
            $updatedFile = 'uploads/' . $request->file_name;
            // $data = ["file_path" => $updatedFile, "extraction_type" => "others"];
            ProcessCSVFileInBatchJob::dispatch($finalPath);
            //$this->processCsv($data);
            //$data2 = ["file_path" => $updatedFile, "extraction_type" => "property"];
            //$this->processCsv($data2);
            return response()->json([
                'status' => 'success',
                'message' => 'File uploaded successfully and merged',
            ], 200);
        }
        return response()->json([
            'status' => 'success',
            'message' => 'File uploaded successfully',
        ], 200);
    }

    public function getAllWithFilters(array $filters = [], int $per_page = 50)
    {
        $query = Property::query()
        ->leftJoin('demand_notices', function ($join) {
            $join->on('demand_notices.property_id', '=', 'properties.id')
                ->whereYear('demand_notices.created_at', date('Y'));
        })
        ->select('properties.*') // Ensure only property fields are selected
        ->addSelect(\DB::raw('IF(demand_notices.id IS NULL, 0, 1) as has_demand_notice'))
        ->orderBy('has_demand_notice', 'asc'); // Properties without demand notices first
 
        // Apply dynamic filters
        foreach ($filters as $key => $value) {
         
            switch ($key) {
                case 'street_id':
                    $query->where('street_id', '=', $value);
                    break;
                
                case 'cadastral_zone_id':
                    $query->where('cadastral_zone_id', '=', $value);
                    break;
                case 'property_type_id':
                    $query->where('property_type_id', '=', $value);
                    break;
                
                case 'property_use_id':
                    $query->where('property_use_id', '=', $value);
                    break;
                case 'rating_district_id':
                    $query->where('rating_district_id', '=', $value);
                    break;
                
                case 'category_id':
                    $query->where('category_id', '=', $value);
                    break;
                case 'group_id':
                    $query->where('group_id', '=', $value);
                    break;
                default:
                    // Apply other filters directly (e.g., status)
                    $query->where($key, $value);
                    break;
            }
        }
 
        // Paginate the results
        return $query->paginate($per_page);
    }
}
