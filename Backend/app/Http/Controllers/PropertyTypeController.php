<?php

namespace App\Http\Controllers;
use App\Models\checkIsAdminOrMd;
use App\Models\PropertyType;
use Illuminate\Http\Request;
use App\Service\PropertyTypeService;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\PropertyTypeResource;
use Illuminate\Support\Facades\Validator;

class PropertyTypeController extends Controller
{
    protected $propertyTypeService;

    public function __construct(PropertyTypeService $propertyTypeService)
    {
        $this->propertyTypeService = $propertyTypeService;
    }

    /**
     * @OA\Get(
     *     path="/api/property-type",
     *     summary="Get Property Type list",
     *     tags={"PropertyType"},
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/PropertyTypeResource")
     *         ),
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Unauthenticated."
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="You don't have permission."
     *             )
     *         )
     *     ),
     *     security={{"api_key":{}}}
     * )
     */
    public function index()
    {
        if ($this->propertyTypeService->checkIsAdminOrMd()) {
            $propertyTypes = $this->propertyTypeService->getAllPropertyType();

            if ($propertyTypes) {
                return PropertyTypeResource::collection($propertyTypes)->additional([
                    "status" => "success",
                ]);
            }

            return response()->json([
                "status" => "error",
                "message" => "No property type found",
            ], 404);
        }

        return response()->json([
            "status" => "error",
            "message" => "You don't have permission",
        ], 403);
    }

    /**
     * @OA\POST(
     *     path="/api/property-type/create",
     *     summary="Add a new Property Type",
     *     tags={"PropertyType"},
     *     @OA\Parameter(
     *         name="name",
     *         in="query",
     *         description="The name of the property type.",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="property_type_id",
     *         in="query",
     *         description="ID of the Property Type.",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="status",
     *                 type="string",
     *                 example="success"
     *             ),
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Property type created successfully"
     *             ),
     *             @OA\Property(
     *                 property="data",
     *                 ref="#/components/schemas/PropertyTypeResource"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Bad Request",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="All fields are required."
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Unauthenticated."
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="You don't have permission."
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal Server Error",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="An error occurred."
     *             )
     *         )
     *     ),
     *     security={{"api_key":{}}}
     * )
     */
    public function store(Request $request)
    {
        if ($this->propertyTypeService->checkIsAdminOrMd()) {
            $validator = Validator::make($request->all(), [
                'name' => ['required', 'string', 'max:255'],
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => "All fields are required",
                    'data' => $validator->errors()
                ], 400);
            }

            $addPropertyType = $this->propertyTypeService->create($request->all());

            if ($addPropertyType) {
                return (new PropertyTypeResource($addPropertyType))->additional([
                    'status' => 'success',
                    'message' => 'Property type created successfully'
                ]);
            }

            return response()->json([
                "status" => "error",
                "message" => "An error occurred",
            ], 500);
        }

        return response()->json([
            "status" => "error",
            "message" => "You don't have permission",
        ], 403);
    }

    /**
     * @OA\Get(
     *     path="/api/property-type/view/{propertyType}",
     *     summary="Get a specific Property Type",
     *     tags={"PropertyType"},
     *     @OA\Parameter(
     *         name="propertyType",
     *         in="path",
     *         required=true,
     *         description="The ID of the property type",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(ref="#/components/schemas/PropertyTypeResource")
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Unauthenticated."
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="You don't have permission."
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Requested Property Type not Found",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Requested Property Type not found"
     *             )
     *         )
     *     ),
     *     security={{"api_key":{}}}
     * )
     */
    public function show($propertyType)
    {
        if ($this->propertyTypeService->checkIsAdminOrMd()) {
            $getPropertyType = $this->propertyTypeService->getPropertyTypeById($propertyType);

            if ($getPropertyType) {
                return (new PropertyTypeResource($getPropertyType))->additional([
                    'status' => 'success'
                ]);
            }

            return response()->json([
                "status" => "error",
                "message" => "No property type found",
            ], 404);
        }

        return response()->json([
            "status" => "error",
            "message" => "You don't have permission",
        ], 403);
    }

    /**
     * @OA\PUT(
     *     path="/api/property-type/update/{propertyType}",
     *     summary="Update property type details",
     *     tags={"PropertyType"},
     *     @OA\Parameter(
     *         name="propertyType",
     *         in="path",
     *         description="The ID of the property type to update.",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="name",
     *                 type="string",
     *                 description="Name of the property type",
     *                 example="Duplex"
     *             ),
     *             @OA\Property(
     *                 property="property_type_id",
     *                 type="string",
     *                 description="ID of the property type",
     *                 example="2"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="status",
     *                 type="string",
     *                 example="success"
     *             ),
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Property type updated successfully"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Bad Request",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="All fields are required."
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Unauthenticated."
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="You don't have permission."
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal Server Error",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="An error occurred."
     *             )
     *         )
     *     ),
     *     security={{"api_key":{}}}
     * )
     */
    public function update(Request $request, $propertyType)
    {
        if ($this->propertyTypeService->checkIsAdminOrMd()) {
            $validator = Validator::make($request->all(), [
                'name' => ['required', 'string', 'max:255'],
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => "All fields are required",
                    'data' => $validator->errors()
                ], 400);
            }

            $updatePropertyType = $this->propertyTypeService->updatePropertyType($request->all(), $propertyType);

            if ($updatePropertyType) {
                return response()->json([
                    "status" => "success",
                    "message" => "Property type updated successfully",
                ], 200);
            }

            return response()->json([
                "status" => "error",
                "message" => "An error occurred",
            ], 500);
        }

        return response()->json([
            "status" => "error",
            "message" => "You don't have permission",
        ], 403);
    }

    /**
     * @OA\Delete(
     *     path="/api/property-type/delete/{propertyType}",
     *     summary="Delete a specific property type",
     *     tags={"PropertyType"},
     *     @OA\Parameter(
     *         name="propertyType",
     *         in="path",
     *         required=true,
     *         description="The ID of the property type to delete",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="status",
     *                 type="string",
     *                 example="success"
     *             ),
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Property type deleted successfully"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Bad request",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="status",
     *                 type="string",
     *                 example="error"
     *             ),
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="An error occurred"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Unauthenticated."
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="You don't have permission"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Requested Property Type not found",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Requested Property Type not found"
     *             )
     *         )
     *     ),
     *     security={{"api_key":{}}}
     * )
     */
    public function destroy($propertyType)
    {
        if ($this->propertyTypeService->checkIsAdminOrMd()) {
            $propertyTypeDelete = $this->propertyTypeService->deletePropertyType($propertyType);

            if ($propertyTypeDelete) {
                return response()->json([
                    "status" => "success",
                    "message" => "Property type deleted successfully",
                ], 200);
            }

            return response()->json([
                "status" => "error",
                "message" => "An error occurred",
            ], 400);
        }

        return response()->json([
            "status" => "error",
            "message" => "You don't have permission",
        ], 403);
    }
}
