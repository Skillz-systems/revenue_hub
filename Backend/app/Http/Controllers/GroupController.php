<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Illuminate\Http\Request;
use App\Service\GroupService;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\GroupResource;
use Illuminate\Support\Facades\Validator;

class GroupController extends Controller
{
    protected $groupService;

    public function __construct(GroupService $groupService)
    {
        $this->groupService = $groupService;
    }

    /**
     * @OA\Get(
     *     path="/api/group",
     *     summary="Get Group list",
     *     tags={"Group"},
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/GroupResource")
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
        if ($this->groupService->checkIsAdminOrMd()) {
            $groups = $this->groupService->getAllGroup();

            if ($groups) {
                return GroupResource::collection($groups)->additional([
                    "status" => "success",
                ]);
            }

            return response()->json([
                "status" => "error",
                "message" => "No group found",
            ], 404);
        }

        return response()->json([
            "status" => "error",
            "message" => "You don't have permission",
        ], 403);
    }

    /**
     * @OA\POST(
     *     path="/api/group/create",
     *     summary="Add a new Group",
     *     tags={"Group"},
     *     @OA\Parameter(
     *         name="name",
     *         in="query",
     *         description="The name of the group.",
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
     *                 example="Group created successfully"
     *             ),
     *             @OA\Property(
     *                 property="data",
     *                 ref="#/components/schemas/GroupResource"
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
        if ($this->groupService->checkIsAdminOrMd()) {
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

            $addGroup = $this->groupService->create($request->all());

            if ($addGroup) {
                return (new GroupResource($addGroup))->additional([
                    'status' => 'success',
                    'message' => 'Group created successfully'
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
     *     path="/api/group/view/{group}",
     *     summary="Get a specific Group",
     *     tags={"Group"},
     *     @OA\Parameter(
     *         name="group",
     *         in="path",
     *         required=true,
     *         description="The ID of the group",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(ref="#/components/schemas/GroupResource")
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
     *         description="Requested Group not Found",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Requested Group not found"
     *             )
     *         )
     *     ),
     *     security={{"api_key":{}}}
     * )
     */
    public function show($group)
    {
        if ($this->groupService->checkIsAdminOrMd()) {
            $getGroup = $this->groupService->getGroupById($group);

            if ($getGroup) {
                return (new GroupResource($getGroup))->additional([
                    'status' => 'success'
                ]);
            }

            return response()->json([
                "status" => "error",
                "message" => "No group found",
            ], 404);
        }

        return response()->json([
            "status" => "error",
            "message" => "You don't have permission",
        ], 403);
    }

    /**
     * @OA\PUT(
     *     path="/api/group/update/{group}",
     *     summary="Update group details",
     *     tags={"Group"},
     *     @OA\Parameter(
     *         name="group",
     *         in="path",
     *         description="The ID of the group to update.",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="name",
     *                 type="string",
     *                 description="Name of the group",
     *                 example="Duplex"
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
     *                 example="Group updated successfully"
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
    public function update(Request $request, $group)
    {
        if ($this->groupService->checkIsAdminOrMd()) {
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

            $updateGroup = $this->groupService->updateGroup($request->all(), $group);

            if ($updateGroup) {
                return response()->json([
                    "status" => "success",
                    "message" => "Group updated successfully",
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
     *     path="/api/group/delete/{group}",
     *     summary="Delete a specific group",
     *     tags={"Group"},
     *     @OA\Parameter(
     *         name="group",
     *         in="path",
     *         required=true,
     *         description="The ID of the group to delete",
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
     *                 example="Group deleted successfully"
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
     *         description="Requested Group not found",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Requested Group not found"
     *             )
     *         )
     *     ),
     *     security={{"api_key":{}}}
     * )
     */
    public function destroy($group)
    {
        if ($this->groupService->checkIsAdminOrMd()) {
            $groupDelete = $this->groupService->deleteGroup($group);

            if ($groupDelete) {
                return response()->json([
                    "status" => "success",
                    "message" => "Group deleted successfully",
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
