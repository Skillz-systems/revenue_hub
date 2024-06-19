<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CadastralZone;
use App\Service\CadastralZoneService;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\CadastralZoneResource;

class CadastralZoneController extends Controller
{
    protected $cadastralZoneService;
    public function __construct(CadastralZoneService $cadastralZoneService)
    {
        $this->cadastralZoneService = $cadastralZoneService;
    }

    /**
     * @OA\Get(
     *     path="/api/cadastral-zone",
     *     summary="Get the list of cadastral-zone",
     *     tags={"Cadastral Zone"},
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/CadastralZoneResource")
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

        if ($this->cadastralZoneService->checkIsAdminOrMd()) {

            $cadastralZone = $this->cadastralZoneService->getAllCadastralZone();

            if ($cadastralZone) {
                return CadastralZoneResource::collection($cadastralZone)->additional([
                    "status" => "success",
                ]);
            }

            return response()->json([
                "status" => "error",
                "message" => "No Cadastral Zone found",
            ], 404);
        }

        return response()->json([
            "status" => "error",
            "message" => "You dont Have Permission",
        ], 403);
    }

    /**
     * @OA\POST(
     *     path="/api/cadastral-zone/create",
     *     summary="Add new cadastral Zone",
     *     tags={"Cadastral Zone"},
     *      @OA\Parameter(
     *         name="name",
     *         in="query",
     *         description="The name of the cadastral-zone.",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *      @OA\Parameter(
     *         name="rating_district_id",
     *         in="query",
     *         description="ID of the Rating district.",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/CadastralZoneResource")
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
        if ($this->cadastralZoneService->checkIsAdminOrMd()) {

            $validator = Validator::make($request->all(), [
                'name' => ['required', 'string', 'max:255'],
                'rating_district_id' => ['required', 'string', 'max:255'],
            ]);


            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => "All fields are required",
                    "data" => $validator->errors()
                ], 400);
            }

            $addcadastralZone = $this->cadastralZoneService->create($request->all());
            if ($addcadastralZone) {
                $returnCadastralZone = new CadastralZoneResource($addcadastralZone);
                $returnCadastralZone->additional([
                    'status' => 'success',
                ]);
                return $returnCadastralZone;
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
     *     path="/api/cadastral-zone/view/{cadastralZone}",
     *     summary="Get a specific cadastral-zone",
     *     tags={"Cadastral Zone"},
     *     @OA\Parameter(
     *         name="cadastralZone",
     *         in="path",
     *         required=true,
     *         description="The ID of the cadastral-zone to view",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(ref="#/components/schemas/CadastralZoneResource")
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
     *         description="No Cadastral Zone Found",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="No Cadastral Zone Found"
     *             )
     *         )
     *     ),
     *     security={{"api_key":{}}}
     * )
     */
    public function show($cadastralZone)
    {
        if ($this->cadastralZoneService->checkIsAdminOrMd()) {
            $getZone = $this->cadastralZoneService->getCadastralZoneById($cadastralZone);
            if ($getZone) {
                $returnCadastralZone = new CadastralZoneResource($getZone);
                $returnCadastralZone->additional([
                    'status' => 'success',
                ]);
                return  $returnCadastralZone;
            }

            return response()->json([
                "status" => "error",
                "message" => "No Cadastral Zone Found",
            ], 404);
        }
        return response()->json([
            "status" => "error",
            "message" => "You dont Have Permission",
        ], 403);
    }

    /**
     * @OA\PUT(
     *     path="/api/cadastral-zone/update/{cadastralZone}",
     *     summary="update cadastral-zone details",
     *     tags={"Cadastral Zone"},
     *      @OA\Parameter(
     *         name="cadastralZone",
     *         in="path",
     *         description="The ID of the cadastral-zone to update.",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="name",
     *                 type="string",
     *                 description="Name of the cadastral-zone",
     *                 example="Odoko cadastral-zone"
     *             ),
     *             @OA\Property(
     *                 property="rating_district_id",
     *                 type="string",
     *                 description="ID of the Rating district",
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
     *                 example="Cadastral Zone updated successfully"
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

    public function update(Request $request,  $cadastralZone)
    {
        if ($this->cadastralZoneService->checkIsAdminOrMd()) {
            $validator = Validator::make($request->all(), [
                'name' => ['required', 'string', 'max:255'],
                'rating_district_id' => ['required', 'string', 'max:255'],
            ]);


            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => "All fields are required",
                    "data" => $validator->errors()
                ], 400);
            }

            $updateCadastralZone = $this->cadastralZoneService->updateCadastralZone($request->all(), $cadastralZone);
            if ($updateCadastralZone) {
                return response()->json([
                    "status" => "success",
                    "message" => "Cadastral Zone Updated successfully",
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
     *     path="/api/cadastral-zone/delete/{cadastralZone}",
     *     summary="Delete a specific cadastral-zone",
     *     tags={"Cadastral Zone"},
     *     @OA\Parameter(
     *         name="cadastralZone",
     *         in="path",
     *         required=true,
     *         description="The ID of the cadastral-zone to update",
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
     *                 example="Cadastral Zone deleted successfully"
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
     *         description="No Cadastral Zone Found",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="No Cadastral Zone Found"
     *             )
     *         )
     *     ),
     *     security={{"api_key":{}}}
     * )
     */

    public function destroy($cadastralZone)
    {
        if ($this->cadastralZoneService->checkIsAdminOrMd()) {

            $cadastralZoneDelete = $this->cadastralZoneService->deleteCadastralZone($cadastralZone);
            if ($cadastralZoneDelete) {
                return response()->json([
                    "status" => "success",
                    "message" => "Cadastral Zone deleted successfully",
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
