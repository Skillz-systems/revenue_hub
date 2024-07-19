<?php

namespace App\Http\Controllers;

use App\Models\checkIsAdminOrMd;
use App\Models\RatingDistrict;
use Illuminate\Http\Request;
use App\Service\RatingDistrictService;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\RatingDistrictResource;
use Illuminate\Support\Facades\Validator;

class RatingDistrictController extends Controller
{
    protected $ratingDistrictService;
    public function __construct(RatingDistrictService $ratingDistrictService)
    {
        $this->ratingDistrictService = $ratingDistrictService;
    }

    /**
     * @OA\Get(
     *     path="/api/rating-district",
     *     summary="Get rating district",
     *     tags={"RatingDistrict"},
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/RatingDistrictResource")
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

        if ($this->ratingDistrictService->checkIsAdminOrMd()) {

            $ratingDistrict = $this->ratingDistrictService->getAllRatingDistrict();

            if ($ratingDistrict) {
                return RatingDistrictResource::collection($ratingDistrict)->additional([
                    "status" => "success",
                ]);
            }

            return response()->json([
                "status" => "error",
                "message" => "No rating district found",
            ], 404);
        }

        return response()->json([
            "status" => "error",
            "message" => "You don't Have Permission",
        ], 403);
    }

    /**
     * @OA\POST(
     *     path="/api/rating-district/create",
     *     summary="Add new rating district",
     *     tags={"RatingDistrict"},
     *      @OA\Parameter(
     *         name="name",
     *         in="query",
     *         description="The name of rating district.",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *      @OA\Parameter(
     *         name="office_zone_id",
     *         in="query",
     *         description="ID for the office Zone.",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/RatingDistrictResource")
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
        if ($this->ratingDistrictService->checkIsAdminOrMd()) {

            $validator = Validator::make($request->all(), [
                'name' => ['required', 'string', 'max:255'],
                'office_zone_id' => ['required', 'string', 'max:255'],
            ]);


            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => "All fields are required",
                    "data" => $validator->errors()
                ], 400);
            }

            $addratingDistrict = $this->ratingDistrictService->create($request->all());
            if ($addratingDistrict) {
                $returnRatingDistrict = new RatingDistrictResource($addratingDistrict);
                $returnRatingDistrict->additional([
                    'status' => 'success',
                ]);
                return $returnRatingDistrict;
            }

            return response()->json([
                "status" => "error",
                "message" => "An error occurred",
            ], 500);
        }

        return response()->json([
            "status" => "error",
            "message" => "You don't Have Permission",
        ], 403);
    }


    /**
     * @OA\Get(
     *     path="/api/rating-district/view/{ratingDistrict}",
     *     summary="Get a specific rating district",
     *     tags={"RatingDistrict"},
     *     @OA\Parameter(
     *         name="rating district",
     *         in="path",
     *         required=true,
     *         description="The ID of the rating district to update",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(ref="#/components/schemas/RatingDistrictResource")
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
     *         description="No rating district Found",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="No rating district Found"
     *             )
     *         )
     *     ),
     *     security={{"api_key":{}}}
     * )
     */
    public function show($ratingDistrict)
    {
        if ($this->ratingDistrictService->checkIsAdminOrMd()) {
            $getRatingDistrict = $this->ratingDistrictService->getRatingDistrictById($ratingDistrict);
            if ($getRatingDistrict) {
                $returnRatingDistrict = new RatingDistrictResource($getRatingDistrict);
                $returnRatingDistrict->additional([
                    'status' => 'success', // or any other status you want to append
                ]);
                return  $returnRatingDistrict;
            }

            return response()->json([
                "status" => "error",
                "message" => "No rating district Found",
            ], 404);
        }
        return response()->json([
            "status" => "error",
            "message" => "You dont Have Permission",
        ], 403);
    }

    /**
     * @OA\PUT(
     *     path="/api/rating-district/update/{ratingDistrict}",
     *     summary="update rating district details",
     *     tags={"RatingDistrict"},
     *      @OA\Parameter(
     *         name="ratingDistrict",
     *         in="path",
     *         description="The ID of the rating district to update.",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="name",
     *                 type="string",
     *                 description="Name of the rating district",
     *                 example="kolan rating district"
     *             ),
     *             @OA\Property(
     *                 property="office_zone_id",
     *                 type="string",
     *                 description="ID of the office Zone",
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
     *                 example=Rating District updated successfully"
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
    public function update(Request $request, $ratingDistrict)
    {
        if ($this->ratingDistrictService->checkIsAdminOrMd()) {
            $validator = Validator::make($request->all(), [
                'name' => ['required', 'string', 'max:255'],
                'office_zone_id' => ['required', 'string', 'max:255'],
            ]);


            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => "All fields are required",
                    "data" => $validator->errors()
                ], 400);
            }

            $updateratingDistrict = $this->ratingDistrictService->updateRatingDistrict($request->all(), $ratingDistrict);
            if ($updateratingDistrict) {
                return response()->json([
                    "status" => "success",
                    "message" => "Rating District Updated successfully",
                ], 200);
            }

            return response()->json([
                "status" => "error",
                "message" => "An error occurred",
            ], 500);
        }

        return response()->json([
            "status" => "error",
            "message" => "You dont Have Permission",
        ], 403);
    }

    /**
     * @OA\Delete(
     *     path="/api/rating-district/delete/{ratingDistrict}",
     *     summary="Delete a specific rating district",
     *     tags={"RatingDistrict"},
     *     @OA\Parameter(
     *         name="ratingDistrict",
     *         in="path",
     *         required=true,
     *         description="The ID of the rating district to update",
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
     *                 example="Rating District deleted successfully"
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
     *         description="No rating district Found",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="No rating district Found"
     *             )
     *         )
     *     ),
     *     security={{"api_key":{}}}
     * )
     */
    public function destroy($ratingDistrict)
    {
        if ($this->ratingDistrictService->checkIsAdminOrMd()) {

            $ratingDistrictDelete = $this->ratingDistrictService->deleteRatingDistrict($ratingDistrict);
            if ($ratingDistrictDelete) {
                return response()->json([
                    "status" => "success",
                    "message" => "Rating District deleted successfully",
                ], 200);
            }

            return response()->json([
                "status" => "error",
                "message" => "An error occurred",
            ], 400);
        }
        return response()->json([
            "status" => "error",
            "message" => "You dont Have Permission",
        ], 403);
    }
}