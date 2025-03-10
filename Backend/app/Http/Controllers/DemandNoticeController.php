<?php

namespace App\Http\Controllers;

use App\Http\Resources\BatchDemandNoticeResource;
use App\Models\User;
use App\Models\DemandNotice;
use Illuminate\Http\Request;
use App\Service\DemandNoticeService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\DemandNoticeResource;

class DemandNoticeController extends Controller
{
    protected $demandNoticeService;
    public function __construct(DemandNoticeService $demandNoticeService)
    {
        $this->demandNoticeService = $demandNoticeService;
    }


    /**
     * @OA\Post(
     *     path="/demand-notice",
     *     summary="Get paginated list of demand notices",
     *     tags={"Demand Notice"},
     *      @OA\Parameter(
     *         name="date_filter",
     *         in="query",
     *         description="Optional. The year for which to retrieve data. Defaults to the current year if not provided.",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/DemandNoticeResource")
     *         ),
     *         @OA\Header(
     *             header="X-Pagination-Total-Count",
     *             description="Total count of demand notices",
     *             @OA\Schema(type="integer")
     *         ),
     *         @OA\Header(
     *             header="X-Pagination-Page-Count",
     *             description="Total count of pages",
     *             @OA\Schema(type="integer")
     *         ),
     *         @OA\Header(
     *             header="X-Pagination-Per-Page",
     *             description="Demand notices per page",
     *             @OA\Schema(type="integer")
     *         ),
     *         @OA\Header(
     *             header="X-Pagination-Current-Page",
     *             description="Current page number",
     *             @OA\Schema(type="integer")
     *         ),
     *         @OA\Header(
     *             header="X-Pagination-Next-Page",
     *             description="Next page number",
     *             @OA\Schema(type="integer")
     *         ),
     *         @OA\Header(
     *             header="X-Pagination-Prev-Page",
     *             description="Previous page number",
     *             @OA\Schema(type="integer")
     *         ),
     *         @OA\Header(
     *             header="X-Pagination-From",
     *             description="Starting item number of the current page (starts at 1)",
     *             @OA\Schema(type="integer")
     *         ),
     *         @OA\Header(
     *             header="X-Pagination-To",
     *             description="Ending item number of the current page",
     *             @OA\Schema(type="integer")
     *         ),
     *         @OA\Header(
     *             header="X-Pagination-Last-Page",
     *             description="Last page number",
     *             @OA\Schema(type="integer")
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
     *                 example="This action is unauthorized."
     *             )
     *         )
     *     ),
     *     security={{"bearerAuth":{}}}
     * )
     */
    public function index(Request $request)
    {
        $defaultDate = date("Y");
        if ($request->date_filter) {
            $defaultDate = $request->date_filter;
        }
        $service = $this->demandNoticeService;
        $getPaginatedDemandNotice = $service->allDemandNotice($defaultDate);
        $demandNotice = DemandNoticeResource::collection($getPaginatedDemandNotice);
        $demandNotice->additional([
            'status' => 'success' // or any other status you want to append
        ]);
        return $demandNotice;
    }



    /**
     * @OA\Post(
     *     path="/demand-notice/create",
     *     summary="Create a new demand notice",
     *     tags={"Demand Notice"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="property_id",
     *                 type="integer",
     *                 description="ID of the property associated with the demand notice",
     *                 example="1"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Successful operation",
     *         @OA\JsonContent(ref="#/components/schemas/DemandNoticeResource")
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
     *                 example="Property ID is missing"
     *             ),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(
     *                     property="property_id",
     *                     type="array",
     *                     @OA\Items(type="string")
     *                 )
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
     *                 example="This action is unauthorized."
     *             )
     *         )
     *     ),
     *     security={{"bearerAuth":{}}}
     * )
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'property_id' => ['required', 'integer'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => "Property ID is missing",
                "data" => $validator->errors()
            ], 400);
        }

        $createDemandNotice = $this->demandNoticeService->createDemandNotice($request->property_id);
        $demandNotice = new DemandNoticeResource($createDemandNotice);
        $demandNotice->additional([
            'status' => 'success' // or any other status you want to append
        ]);
        return $demandNotice;
    }

    /**
     * @OA\Get(
     *     path="/demand-notice/view/{demandNoticeId}",
     *     summary="Get a specific demand notice",
     *     tags={"Demand Notice"},
     *     @OA\Parameter(
     *         name="demandNoticeId",
     *         in="path",
     *         required=true,
     *         description="ID of the demand notice to retrieve",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(ref="#/components/schemas/DemandNoticeResource")
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
     *                 example="This action is unauthorized."
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Demand notice not found",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Demand notice not found"
     *             )
     *         )
     *     ),
     *     security={{"bearerAuth":{}}}
     * )
     */
    public function show(DemandNotice $demandNotice)
    {
        $id = $demandNotice->id;
        $service = $this->demandNoticeService;
        $getDemandNotice = $service->viewDemandNotice($id);
        $getDemandNotice->load('reminder');
        $demandNoticeResource = new DemandNoticeResource($getDemandNotice);
        $demandNoticeResource->additional([
            'status' => 'success'
        ]);

        return $demandNoticeResource;
    }



    /**
     * @OA\Put(
     *     path="/demand-notice/update/{demandNoticeId}",
     *     summary="Update a specific demand notice",
     *     tags={"Demand Notice"},
     *     @OA\Parameter(
     *         name="demandNoticeId",
     *         in="path",
     *         required=true,
     *         description="ID of the demand notice to update",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="property_id",
     *                 type="integer",
     *                 description="ID of the property associated with the demand notice",
     *                 example="1"
     *             ),
     *             @OA\Property(
     *                 property="amount",
     *                 type="string",
     *                 description="Amount of the demand notice",
     *                 example="100.00"
     *             ),
     *             @OA\Property(
     *                 property="arrears_amount",
     *                 type="string",
     *                 description="Arrears amount of the demand notice",
     *                 example="50.00"
     *             ),
     *             @OA\Property(
     *                 property="penalty",
     *                 type="string",
     *                 description="Penalty of the demand notice",
     *                 example="10.00"
     *             ),
     *             @OA\Property(
     *                 property="status",
     *                 type="integer",
     *                 description="Status of the demand notice",
     *                 example="1"
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
     *                 example="Data has been updated"
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
     *                 example="Something went wrong"
     *             ),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(
     *                     property="property_id",
     *                     type="array",
     *                     @OA\Items(type="string")
     *                 ),
     *                 @OA\Property(
     *                     property="amount",
     *                     type="array",
     *                     @OA\Items(type="string")
     *                 ),
     *                 @OA\Property(
     *                     property="arrears_amount",
     *                     type="array",
     *                     @OA\Items(type="string")
     *                 ),
     *                 @OA\Property(
     *                     property="penalty",
     *                     type="array",
     *                     @OA\Items(type="string")
     *                 ),
     *                 @OA\Property(
     *                     property="status",
     *                     type="array",
     *                     @OA\Items(type="string")
     *                 )
     *             )
     *         )
     *     ),
     *    
     *     
     *      security={{"bearerAuth":{}}}
     * )
     */
    public function update(Request $request, DemandNotice $demandNotice)
    {
        $validator = Validator::make($request->all(), [
            'property_id' => ['sometimes', "integer"],
            'amount' => ['sometimes', "string"],
            "arrears_amount" => ['sometimes', "string"],
            "penalty" => ['sometimes', "string"],
            "status" => ['sometimes', "integer"],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => "Something went wrong",
                "data" => $validator->errors()
            ], 400);
        }

        $updateDemandNotice = $this->demandNoticeService->updateDemandNotice($demandNotice->id, $request->all());

        if ($updateDemandNotice) {
            return response()->json([
                'status' => 'success',
                'message' => "Data has been updated",
            ], 200);
        }
        return response()->json([
            'status' => 'error',
            'message' => "Something went wrong",
        ], 400);
    }

    /**
     * @OA\Delete(
     *     path="/demand-notice/delete/{demandNoticeId}",
     *     summary="Delete a specific demand notice",
     *     tags={"Demand Notice"},
     *     @OA\Parameter(
     *         name="demandNoticeId",
     *         in="path",
     *         required=true,
     *         description="ID of the demand notice to delete",
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
     *                 example="Something went wrong"
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
     *                 example="This action is unauthorized."
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Demand notice not found",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Demand notice not found"
     *             )
     *         )
     *     ),
     *     security={{"bearerAuth":{}}}
     * )
     */
    public function destroy(DemandNotice $demandNotice)
    {
        if (Auth::user()->role_id == User::ROLE_MD) {

            $deleteDemandNotice = $this->demandNoticeService->deleteDemandNotice($demandNotice->id);

            if ($deleteDemandNotice) {
                return response()->json([
                    'status' => 'success',
                ], 200);
            }
            return response()->json([
                'status' => 'error',
                'message' => "Something went wrong",
            ], 400);
        }
        return response()->json([
            "status" => "error",
            "message" => "You dont Have Permission",
        ], 401);
    }

    /**
     * @OA\Post(
     *     path="/demand-notice/{demandNoticeId}/create-reminder",
     *     summary="Create a reminder for a demand notice",
     *     tags={"Demand Notice"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID of the demand notice for which the reminder will be created",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Reminder created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="status",
     *                 type="string",
     *                 example="success"
     *             ),
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Reminder created successfully"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Reminder could not be created",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="status",
     *                 type="string",
     *                 example="error"
     *             ),
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Reminder could not be created"
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
     *                 example="This action is unauthorized."
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Demand notice not found",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Demand notice not found"
     *             )
     *         )
     *     ),
     *     security={{"bearerAuth":{}}}
     * )
     */
    public function createReminder($demandNotice)
    {
        $getDemandNotice = DemandNotice::where(["id" => $demandNotice])->with(["reminder"])->first();
        $reminder = $this->demandNoticeService->createReminder($getDemandNotice);

        if ($reminder) {
            return response()->json([
                'status' => 'success',
                'message' => 'Reminder created successfully',
                $getDemandNotice

            ]);
        }
        return response()->json([
            'status' => 'error',
            'message' => 'Reminder could not be created',
            "error" => $getDemandNotice
        ]);
    }
    public function createBulkDemandNotice(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rating_district_id' => ['required', "integer"],
            'cadastral_zone_id' => ['required', "integer"],
            "street_id" => ['required', "integer"],

        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => "Something went wrong",
                "data" => $validator->errors()
            ], 400);
        }

        $createBulkDemandNotice = $this->demandNoticeService->createBulkDemandNotice($request->all());
        if ($createBulkDemandNotice) {
            return response()->json([
                'status' => 'success',
                'message' => 'Bulk Demand Notice created successfully',
            ], 200);
        }
        return response()->json([
            'status' => 'error',
            'message' => 'Issue creating bulk Demand Notice .',
        ], 400);
    }

    public function getBatchDemandNotice()
    {
        $getBulkDemandNotice = $this->demandNoticeService->getAllBatchDemandNoticesCurrentYear();
        if ($getBulkDemandNotice) {
            $bulkDemandNotice = BatchDemandNoticeResource::collection($getBulkDemandNotice);
            $bulkDemandNotice->additional([
                'status' => 'success' // or any other status you want to append
            ]);
            return $bulkDemandNotice;
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Issue fetching bulk Demand Notice .',
        ], 400);
    }

    public function getBatchDemandNoticeForPrinting($id)
    {
        $getBulkDemandNotice = $this->demandNoticeService->fetchBatchForPrinting($id);
        if ($getBulkDemandNotice) {
            $demandNotice = DemandNoticeResource::collection($getBulkDemandNotice);
            $demandNotice->additional([
                'status' => 'success' // or any other status you want to append
            ]);
            return $demandNotice;
        }
        return response()->json([
            'status' => 'error',
            'message' => 'Issue fetching bulk Demand Notice .',
        ], 400);
    }
}
