<?php

namespace App\Http\Controllers;

use App\Models\PropertyUse;
use Illuminate\Http\Request;
use App\Service\PropertyUseService;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\PropertyUseResource;

class PropertyUseController extends Controller
{
    protected $propertyUseService;
    public function __construct(PropertyUseService $propertyUseService)
    {
        $this->propertyUseService = $propertyUseService;
    }


    /**
     * @OA\Get(
     *     path="/api/property-use",
     *     summary="Get the list of property use",
     *     tags={"Property Use"},
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/PropertyUseResource")
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
     *                 example="You dont Have Permission."
     *             )
     *         )
     *     ),
     *     security={{"api_key":{}}}
     * )
     *
     **/
    public function index()
    {

        if ($this->propertyUseService->checkIsAdminOrMd()) {

            $propertyUse = $this->propertyUseService->getAllPropertyUse();

            if ($propertyUse) {
                return PropertyUseResource::collection($propertyUse)->additional([
                    "status" => "success",
                ]);
            }

            return response()->json([
                "status" => "error",
                "message" => "No Property Use found",
            ], 404);
        }

        return response()->json([
            "status" => "error",
            "message" => "You dont Have Permission",
        ], 403);
    }


    /**
     * @OA\POST(
     *     path="/api/property-use/create",
     *     summary="Add new property use",
     *     tags={"Property Use"},
     *      @OA\Parameter(
     *         name="name",
     *         in="query",
     *         description="The name of the property use.",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/PropertyUseResource")
     *         ),
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
     *                 example="You dont Have Permission."
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
     *                 example="An error occured."
     *             )
     *         )
     *     ),
     *     security={{"api_key":{}}}
     * )
     */
    public function store(Request $request)
    {
        if ($this->propertyUseService->checkIsAdminOrMd()) {

            $validator = Validator::make($request->all(), [
                'name' => ['required', 'string', 'max:255'],
            ]);


            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => "All fields are required",
                    "data" => $validator->errors()
                ], 400);
            }

            $addpropertyUse = $this->propertyUseService->create($request->all());
            if ($addpropertyUse) {
                $returnPropertyUse = new PropertyUseResource($addpropertyUse);
                $returnPropertyUse->additional([
                    'status' => 'success',
                ]);
                return $returnPropertyUse;
            }

            return response()->json([
                "status" => "error",
                "message" => "An error occured",
            ], 500);
        }

        return response()->json([
            "status" => "error",
            "message" => "You dont Have Permission",
        ], 403);
    }


    /**
     * @OA\Get(
     *     path="/api/property-use/view/{propertyUse}",
     *     summary="Get a specific property use",
     *     tags={"Property Use"},
     *     @OA\Parameter(
     *         name="propertyUse",
     *         in="path",
     *         required=true,
     *         description="The ID of the property use to view",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(ref="#/components/schemas/PropertyUseResource")
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
     *                 example="You dont Have Permission."
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No PropertyUse Found",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="No Property Use Found"
     *             )
     *         )
     *     ),
     *     security={{"api_key":{}}}
     * )
     */
    public function show($propertyUse)
    {
        if ($this->propertyUseService->checkIsAdminOrMd()) {
            $getPropertyUse = $this->propertyUseService->getPropertyUseById($propertyUse);
            if ($getPropertyUse) {
                $returnPropertyUse = new PropertyUseResource($getPropertyUse);
                $returnPropertyUse->additional([
                    'status' => 'success', // or any other status you want to append
                ]);
                return  $returnPropertyUse;
            }

            return response()->json([
                "status" => "error",
                "message" => "No Property Use Found",
            ], 404);
        }
        return response()->json([
            "status" => "error",
            "message" => "You dont Have Permission",
        ], 403);
    }

    /**
     * @OA\PUT(
     *     path="/api/property-use/update/{propertyUse}",
     *     summary="update property Use details",
     *     tags={"Property Use"},
     *      @OA\Parameter(
     *         name="propertyUse",
     *         in="path",
     *         description="The ID of the property use to update.",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="name",
     *                 type="string",
     *                 description="Name of the property use",
     *                 example="Residential"
     *             ),
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
     *                 example="Property Use updated successfully"
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
     *                 example="You dont Have Permission."
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
     *                 example="An error occured."
     *             )
     *         )
     *     ),
     *     security={{"api_key":{}}}
     * )
     */
    public function update(Request $request, $propertyUse)
    {
        if ($this->propertyUseService->checkIsAdminOrMd()) {
            $validator = Validator::make($request->all(), [
                'name' => ['required', 'string', 'max:255'],
            ]);


            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => "All fields are required",
                    "data" => $validator->errors()
                ], 400);
            }

            $updatepropertyUse = $this->propertyUseService->updatePropertyUse($request->all(), $propertyUse);
            if ($updatepropertyUse) {
                return response()->json([
                    "status" => "success",
                    "message" => "Property Use Updated successfully",
                ], 200);
            }

            return response()->json([
                "status" => "error",
                "message" => "An error occured",
            ], 500);
        }

        return response()->json([
            "status" => "error",
            "message" => "You dont Have Permission",
        ], 403);
    }

    /**
     * @OA\Delete(
     *     path="/api/property-use/delete/{propertyUse}",
     *     summary="Delete a specific property use",
     *     tags={"Property Use"},
     *     @OA\Parameter(
     *         name="propertyUse",
     *         in="path",
     *         required=true,
     *         description="The ID of the property use to update",
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
     *                 example="Property Use deleted successfully"
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
     *                 example="You dont Have Permission"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No PropertyUse Found",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="No Property Use Found"
     *             )
     *         )
     *     ),
     *     security={{"api_key":{}}}
     * )
     */
    public function destroy($propertyUse)
    {
        if ($this->propertyUseService->checkIsAdminOrMd()) {

            $propertyUseDelete = $this->propertyUseService->deletePropertyUse($propertyUse);
            if ($propertyUseDelete) {
                return response()->json([
                    "status" => "success",
                    "message" => "Property Use deleted successfully",
                ], 200);
            }

            return response()->json([
                "status" => "error",
                "message" => "An error occured",
            ], 400);
        }
        return response()->json([
            "status" => "error",
            "message" => "You dont Have Permission",
        ], 403);
    }
}
