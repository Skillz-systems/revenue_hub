<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Service\OfficeZoneService;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\OfficeZoneResource;

class OfficeZoneController extends Controller
{

    protected $officeZone;
    public function __construct(OfficeZoneService $officeZone)
    {
        $this->officeZone = $officeZone;
    }

    /**
     * @OA\Get(
     *     path="/api/office-zone",
     *     summary="Get the list of office-zone",
     *     tags={"Office Zone"},
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/OfficeZoneResource")
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

        if ($this->officeZone->checkIsAdminOrMd()) {

            $officeZones = $this->officeZone->getAllOfficeZone();

            if ($officeZones) {
                return OfficeZoneResource::collection($officeZones)->additional([
                    "status" => "success",
                ]);
            }

            return response()->json([
                "status" => "error",
                "message" => "No Office Zone found",
            ], 404);
        }

        return response()->json([
            "status" => "error",
            "message" => "You dont Have Permission",
        ], 403);
    }

    /**
     * @OA\POST(
     *     path="/api/office-zone/create",
     *     summary="Add new cadastral Zone",
     *     tags={"Office Zone"},
     *      @OA\Parameter(
     *         name="name",
     *         in="query",
     *         description="The name of the office-zone.",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *      @OA\Parameter(
     *         name="address",
     *         in="query",
     *         description="Address of the office zone.",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/OfficeZoneResource")
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
        if ($this->officeZone->checkIsAdminOrMd()) {

            $validator = Validator::make($request->all(), [
                'name' => ['required', 'string', 'max:255'],
                'address' => ['required', 'string', 'max:255'],
            ]);


            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => "All fields are required",
                    "data" => $validator->errors()
                ], 400);
            }

            $addOfficeZone = $this->officeZone->create($request->all());
            if ($addOfficeZone) {
                $returnOfficeZone = new OfficeZoneResource($addOfficeZone);
                $returnOfficeZone->additional([
                    'status' => 'success',
                ]);
                return $returnOfficeZone;
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
     *     path="/api/office-zone/view/{officeZone}",
     *     summary="Get a specific office-zone",
     *     tags={"Office Zone"},
     *     @OA\Parameter(
     *         name="officeZone",
     *         in="path",
     *         required=true,
     *         description="The ID of the office-zone to view",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(ref="#/components/schemas/OfficeZoneResource")
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
     *         description="No Office Zone Found",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="No Office Zone Found"
     *             )
     *         )
     *     ),
     *     security={{"api_key":{}}}
     * )
     */
    public function show($officeZone)
    {
        if ($this->officeZone->checkIsAdminOrMd()) {

            $getZone = $this->officeZone->getOfficeZoneById($officeZone);

            if ($getZone) {
                $returnOfficeZone = new OfficeZoneResource($getZone);
                $returnOfficeZone->additional([
                    'status' => 'success',
                ]);
                return  $returnOfficeZone;
            }

            return response()->json([
                "status" => "error",
                "message" => "No Office Zone Found",
            ], 404);
        }
        return response()->json([
            "status" => "error",
            "message" => "You dont Have Permission",
        ], 403);
    }

    /**
     * @OA\PUT(
     *     path="/api/office-zone/update/{officeZone}",
     *     summary="update office-zone details",
     *     tags={"Office Zone"},
     *      @OA\Parameter(
     *         name="officeZone",
     *         in="path",
     *         description="The ID of the office-zone to update.",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="name",
     *                 type="string",
     *                 description="Name of the office-zone",
     *                 example="Durumi"
     *             ),
     *             @OA\Property(
     *                 property="address",
     *                 type="string",
     *                 description="Address of the office zone",
     *                 example="Office 2, wuse plaza"
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
     *                 example="Office Zone updated successfully"
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

    public function update(Request $request,  $officeZone)
    {
        if ($this->officeZone->checkIsAdminOrMd()) {
            $validator = Validator::make($request->all(), [
                'name' => ['required', 'string', 'max:255'],
                'address' => ['required', 'string', 'max:255'],
            ]);


            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => "All fields are required",
                    "data" => $validator->errors()
                ], 400);
            }

            $updateOfficeZone = $this->officeZone->updateOfficeZone($request->all(), $officeZone);
            if ($updateOfficeZone) {
                return response()->json([
                    "status" => "success",
                    "message" => "Office Zone Updated successfully",
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
     *     path="/api/office-zone/delete/{officeZone}",
     *     summary="Delete a specific office-zone",
     *     tags={"Office Zone"},
     *     @OA\Parameter(
     *         name="officeZone",
     *         in="path",
     *         required=true,
     *         description="The ID of the office-zone to update",
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
     *                 example="Office Zone deleted successfully"
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
     *         description="No Office Zone Found",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="No Office Zone Found"
     *             )
     *         )
     *     ),
     *     security={{"api_key":{}}}
     * )
     */

    public function destroy($officeZone)
    {
        if ($this->officeZone->checkIsAdminOrMd()) {

            $officeZoneDelete = $this->officeZone->deleteOfficeZone($officeZone);
            if ($officeZoneDelete) {
                return response()->json([
                    "status" => "success",
                    "message" => "Office Zone deleted successfully",
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
