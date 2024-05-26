<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Mail\RegisterMail;
use Illuminate\Http\Request;
use App\Service\StaffService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Http\Requests\StoreUserRequest;
use App\Http\Resources\ShowUserResource;
use App\Http\Resources\StoreUserResource;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{

    private $staffService;
    public function __construct(StaffService $staffService)
    {
        $this->staffService = $staffService;
    }
    /**
     * @OA\GET (
     *     path="/api/staff",
     *     tags={"Staff"},
     *     summary="Get all staffs",
     *     description="Show list of all staffs",
     *     operationId="getStaffs",
     *     security={{"api_key":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="List of all staffs",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/StoreUserResource")
     *         ),
     *     ),
     *     @OA\Response(
     *         response="404",
     *         description="Not found",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="No staff found"),
     *         )
     *     ),
     * )
     */
    public function index()
    {
        $user = $this->staffService->viewAllStaff();

        if ($user) {
            return StoreUserResource::collection($user)->additional([
                "status" => "success",
            ]);
        }

        return response()->json([
            "status" => "error",
            "message" => "No Staff found",
        ], 404);
    }

    /**
     * @OA\Post(
     *     path="/api/staff",
     *     tags={"Staff"},
     *     summary="Register New Staff",
     *     description="This allow the MD to create new staff member",
     *     operationId="registerStaff",
     *     security={{"api_key":{}}},  
     *     @OA\RequestBody(
     *          description="Input staff details to register",
     *          @OA\JsonContent(),
     *          @OA\MediaType(
     *              mediaType="multipart/form-data",
     *          @OA\Schema(
     *              type="object",
     *              required={"name","email", "phone", "zone", "role_id"},
     *              @OA\Property(property="name", description="Staff Fullname", example="Revenue Hub", type="text"),
     *              @OA\Property(property="email", description="Staff Email", type="text", example=""),
     *              @OA\Property(property="phone", description="Staff Phone", type="text", example=""),
     *              @OA\Property(property="zone", description="Staff Zone", type="text", example=""),
     *              @OA\Property(property="role_id", description="Staff Roles", type="string", enum={"2", "3", "4"}),
     *          ),
     *         ),
     *     ),
     *     @OA\Response(
     *         response="200",
     *         description="Registeration Successful",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/StoreUserResource")
     *         ),
     *     ),
     *      @OA\Response(
     *         response="400",
     *         description="All fields are required",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="All fields are required"),
     *         )
     *     ),
     *     @OA\Response(
     *         response="402",
     *         description="An error occurred",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="An error occurred"),
     *         )
     *     ),
     * )
     */
    public function store(StoreUserRequest $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string'],
            'phone' => ['required', 'string', 'min:11'],
            'role_id' => ['required', 'integer'],
            'zone' => ['required', 'string', 'max:255'],
        ]);


        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => "All fields are required ",
                "data" => $validator->errors()
            ], 400);
        }

        $register = (new StaffService)->RegisterStaff($request);
        if ($register) {
            //send mail to the staff
            Mail::to($request->email)->send(new RegisterMail($register));

            return (new StoreUserResource($register))->additional([
                "status" => "success",
                "message" => "Register Successfully",
            ]);
        }
        return response()->json([
            "status" => "error",
            "message" => "An error occurred",
        ], 402);
    }



    /**
     * @OA\GET (
     *     path="/api/staff/{staff}",
     *     tags={"Staff"},
     *     summary="Get a staff",
     *     description="Show details of a staff",
     *     operationId="getStaff",
     *     security={{"api_key":{}}},
     *     @OA\Parameter(
     *         in="path",
     *         name="staff",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Show details of a staff",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/ShowUserResource")
     *         ),
     *     ),
     *     @OA\Response(
     *         response="403",
     *         description="You dont Have Permission",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="You dont Have Permission"),
     *         )
     *     ),
     *     @OA\Response(
     *         response="404",
     *         description="Not found",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="No Staff found"),
     *         )
     *     ),
     * )
     */
    public function show($staff)
    {

        if (Auth::user()->role_id == User::ROLE_ADMIN) {
            $specificStaff = $this->staffService->viewStaff($staff);
            if ($specificStaff) {
                return (new StoreUserResource($specificStaff))->additional([
                    "status" => "success",
                ]);
            }

            return response()->json([
                "status" => "error",
                "message" => "No Staff Found",
            ], 404);
        }

        return response()->json([
            "status" => "error",
            "message" => "You dont Have Permission",
        ], 403);
    }



    /**
     * @OA\PUT(
     *     path="/api/staff/{staff}",
     *     tags={"Staff"},
     *     summary="Update Staff Details",
     *     description="This allow staff member to update their details",
     *     operationId="updateStaff",
     *     security={{"api_key":{}}},
     *     @OA\Parameter(
     *         in="path",
     *         name="staff",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ), 
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 @OA\Property(
     *                      type="object",
     *                      @OA\Property(
     *                          property="name",
     *                          type="string"
     *                      ),
     *                      @OA\Property(
     *                          property="email",
     *                          type="string"
     *                      ),
     *                      @OA\Property(
     *                          property="phone",
     *                          type="string"
     *                      ),
     *                      @OA\Property(
     *                          property="zone",
     *                          type="string"
     *                      ),
     *                      @OA\Property(
     *                          property="role_id", 
     *                          description="Staff Roles", 
     *                          type="string", 
     *                          enum={"2", "3", "4"}),
     *                      ),
     *                 example={
     *                     "name":"example name",
     *                     "email":"example email",
     *                     "phone":"example phone",
     *                     "zone":"example zone",
     *                     "role_id":"example role"
     *                }
     *             )
     *         )
     *      ),
     *     @OA\Response(
     *         response="200",
     *         description="Update Successful",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Update Successfully"),
     *        ),
     *     ),
     *     @OA\Response(
     *         response="400",
     *         description="All Fields are Required",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="All Fields are required"),
     *         )
     *     ),
     *     @OA\Response(
     *         response="401",
     *         description="Credential error",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Credential error: You are not authorize"),
     *         )
     *     ),
     *
     * )
     *
     */

    public function update(Request $request, $staff)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', "email"],
            'phone' => ['sometimes', 'string', 'min:11'],
            'role_id' => ['sometimes', 'string', 'max:255'],
            'zone' => ['sometimes', 'string', 'max:255'],
        ]);


        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => "All fields are required ",
                "data" => $validator->errors()
            ], 400);
        }

        if (Auth::user()->role_id !== User::ROLE_ADMIN) {
            unset($request['role_id']);
            unset($request['zone']);
        }
        if (Auth::user()->role_id === User::ROLE_ADMIN || Auth::user()->id == $staff) {
            $update = (new StaffService)->updateStaff($request, $staff);
            if ($update) {
                return response()->json([
                    'status' => 'success',
                    'message' => "Update Successfully",
                ], 200);
            }
        }


        return response()->json([
            "status" => "error",
            "message" => "Credential error: You are not authorize",
        ], 401);
    }

    /**
     * @OA\Delete (
     *     path="/api/staff/{staff}",
     *     tags={"Staff"},
     *     summary="Delete a staff",
     *     description="This allow staff admin to delete staff",
     *     operationId="deleteStaff",
     *     security={{"api_key":{}}},
     *     @OA\Parameter(
     *         in="path",
     *         name="staff",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     
     *     @OA\Response(
     *         response=200,
     *         description="Staff deleted successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Staff deleted successfully"),
     *         )
     *     ),
     *     @OA\Response(
     *         response="401",
     *         description="You dont Have Permission",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="You dont Have Permission"),
     *         )
     *     ),
     *     @OA\Response(
     *         response="402",
     *         description="An error occured",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="An error occured"),
     *         )
     *     ),
     * )
     */
    public function destroy(User $user)
    {
        if (Auth::user()->role_id == User::ROLE_ADMIN) {

            if ($this->staffService->deleteStaff($user)) {
                return response()->json([
                    "status" => "success",
                    "message" => "Staff deleted successfully",
                ], 200);
            }

            return response()->json([
                "status" => "error",
                "message" => "An error occurred",
            ], 402);
        }

        return response()->json([
            "status" => "error",
            "message" => "You dont Have Permission",
        ], 401);
    }
}
