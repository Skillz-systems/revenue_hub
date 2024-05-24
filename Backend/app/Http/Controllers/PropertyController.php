<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;
use App\Service\PropertyService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\PropertyResource;
use App\Models\User;

class PropertyController extends Controller
{


    /**
     * @OA\Get(
     *     path="/api/properties",
     *     summary="Get all properties",
     *     tags={"Property"},
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
    public function index()
    {
        $properties = Property::all();

        if ($properties) {

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
     *     path="/api/property",
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
            'pid' => ['required', 'integer', 'max:255', 'unique:properties'],
            'occupant' => ['required', 'string', 'max:255'],
            'prop_addr' => ['required', 'string', 'max:255'],
            'street_name' => ['required', 'string', 'max:255'],
            'asset_no' => ['required', 'string', 'max:255'],
            'cadastral_zone' => ['required', 'string', 'max:255'],
            'prop_type' => ['required', 'string', 'max:255'],
            'prop_use' => ['required', 'string', 'max:255'],
            'rating_dist' => ['required', 'string', 'max:255'],
            'annual_value' => ['required', 'integer', 'max:255'],
            'rate_payable' => ['required', 'integer', 'max:255'],
            //'arrears' => ['required', 'integer', 'max:255'],
            //'penalty' => ['required', 'integer', 'max:255'],
            'grand_total' => ['required', 'integer', 'max:255'],
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
    public function show(Property $property)
    {

        if ($property) {
            $returnProperty = new PropertyResource($property);
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
            'annual_value' => ['sometimes', 'integer'],
            'rate_payable' => ['sometimes', 'integer'],
            //'arrears' => ['required', 'integer'],
            //'penalty' => ['required', 'integer'],
            'grand_total' => ['sometimes', 'integer'],
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
}
