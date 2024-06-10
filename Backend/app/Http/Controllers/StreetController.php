<?php

namespace App\Http\Controllers;

use App\Models\checkIsAdminOrMd;
use App\Models\Street;
use Illuminate\Http\Request;
use App\Service\StreetService;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\StreetResource;
use Illuminate\Support\Facades\Validator;

class StreetController extends Controller
{
    protected $streetService;
    public function __construct(StreetService $streetService)
    {
        $this->streetService = $streetService;
    }

    /**
     * @OA\Get(
     *     path="/api/street",
     *     summary="Get the list of street",
     *     tags={"Street"},
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/StreetResource")
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

        if ($this->streetService->checkIsAdminOrMd()) {

            $street = $this->streetService->getAllStreet();

            if ($street) {
                return StreetResource::collection($street)->additional([
                    "status" => "success",
                ]);
            }

            return response()->json([
                "status" => "error",
                "message" => "No Street found",
            ], 404);
        }

        return response()->json([
            "status" => "error",
            "message" => "You dont Have Permission",
        ], 403);
    }

    /**
     * @OA\POST(
     *     path="/api/street/create",
     *     summary="Add new street",
     *     tags={"Street"},
     *      @OA\Parameter(
     *         name="name",
     *         in="query",
     *         description="The name of the street.",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *      @OA\Parameter(
     *         name="cadastral_zone_id",
     *         in="query",
     *         description="ID of the Cadastral Zone.",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/StreetResource")
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
        if ($this->streetService->checkIsAdminOrMd()) {

            $validator = Validator::make($request->all(), [
                'name' => ['required', 'string', 'max:255'],
                'cadastral_zone_id' => ['required', 'string', 'max:255'],
            ]);


            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => "All fields are required",
                    "data" => $validator->errors()
                ], 400);
            }

            $addstreet = $this->streetService->create($request->all());
            if ($addstreet) {
                $returnStreet = new StreetResource($addstreet);
                $returnStreet->additional([
                    'status' => 'success',
                ]);
                return $returnStreet;
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
     *     path="/api/street/view/{street}",
     *     summary="Get a specific street",
     *     tags={"Street"},
     *     @OA\Parameter(
     *         name="street",
     *         in="path",
     *         required=true,
     *         description="The ID of the street to update",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(ref="#/components/schemas/StreetResource")
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
     *         description="No Street Found",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="No Street Found"
     *             )
     *         )
     *     ),
     *     security={{"api_key":{}}}
     * )
     */
    public function show($street)
    {
        if ($this->streetService->checkIsAdminOrMd()) {
            $getStreet = $this->streetService->getStreetById($street);
            if ($getStreet) {
                $returnStreet = new StreetResource($getStreet);
                $returnStreet->additional([
                    'status' => 'success', // or any other status you want to append
                ]);
                return  $returnStreet;
            }

            return response()->json([
                "status" => "error",
                "message" => "No Street Found",
            ], 404);
        }
        return response()->json([
            "status" => "error",
            "message" => "You dont Have Permission",
        ], 403);
    }

    /**
     * @OA\PUT(
     *     path="/api/street/update/{street}",
     *     summary="update street details",
     *     tags={"Street"},
     *      @OA\Parameter(
     *         name="street",
     *         in="path",
     *         description="The ID of the street to update.",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="name",
     *                 type="string",
     *                 description="Name of the street",
     *                 example="Odoko street"
     *             ),
     *             @OA\Property(
     *                 property="cadastral_zone_id",
     *                 type="string",
     *                 description="ID of the Cadastral Zone",
     *                 example="2"
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
     *                 example="Street updated successfully"
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
    public function update(Request $request, $street)
    {
        if ($this->streetService->checkIsAdminOrMd()) {
            $validator = Validator::make($request->all(), [
                'name' => ['required', 'string', 'max:255'],
                'cadastral_zone_id' => ['required', 'string', 'max:255'],
            ]);


            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => "All fields are required",
                    "data" => $validator->errors()
                ], 400);
            }

            $updatestreet = $this->streetService->updateStreet($request, $street);
            if ($updatestreet) {
                return response()->json([
                    "status" => "success",
                    "message" => "Street Updated successfully",
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
     *     path="/api/street/delete/{street}",
     *     summary="Delete a specific street",
     *     tags={"Street"},
     *     @OA\Parameter(
     *         name="street",
     *         in="path",
     *         required=true,
     *         description="The ID of the street to update",
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
     *                 example="Street deleted successfully"
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
     *         description="No Street Found",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="No Street Found"
     *             )
     *         )
     *     ),
     *     security={{"api_key":{}}}
     * )
     */
    public function destroy($street)
    {
        if ($this->streetService->checkIsAdminOrMd()) {

            $streetDelete = $this->streetService->deleteStreet($street);
            if ($streetDelete) {
                return response()->json([
                    "status" => "success",
                    "message" => "Street deleted successfully",
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
