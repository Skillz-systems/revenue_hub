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

    /**
     * List all Users
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
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="No User found"),
     *         )
     *     ),
     * )
     */
    public function index()
    {
        $user = User::all();

        if ($user) {
            return response()->json([
                "status" => "success",
                "data" => StoreUserResource::collection($user),
            ], 200);
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
     *          mediaType="multipart/form-data",
     *          @OA\Schema(
     *          type="object",
     *          required={"name","email", "phone", "zone", "role_id"},
     *          @OA\Property(property="name", description="Staff Fullname", example="Revenue Hub", type="text"),
     *          @OA\Property(property="email", description="Staff Email", type="text", example=""),
     *          @OA\Property(property="phone", description="Staff Phone", type="text", example=""),
     *          @OA\Property(property="zone", description="Staff Zone", type="text", example=""),
     *          @OA\Property(property="role_id", description="Staff Roles", type="integer", example=""),
     *          ),
     *         ),
     *     ),
     *     @OA\Response(
     *         response="200",
     *         description="Registeration Successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Register Successfully"),
     *             @OA\Property(property="user", type="object",
     *                 @OA\Property(property="id", type="integer", example=9),
     *                 @OA\Property(property="name", type="string", example="abc example2.com"),
     *                 @OA\Property(property="email", type="string", example="abc@example2.com"),
     *                 @OA\Property(property="phone", type="string", example="65728338352"),
     *                 @OA\Property(property="zone", type="string", example="nigeria"),
     *                 @OA\Property(property="role", type="object",
     *                     @OA\Property(property="id", type="integer", example=2),
     *                     @OA\Property(property="name", type="string", example="Admin"),
     *                 ),
     *                 @OA\Property(property="created_at", type="string", format="date-time", example="2024-05-01T20:44:43.000000Z"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time", example="2024-05-01T20:44:43.000000Z"),
     *             ),
     *             @OA\Property(property="token", type="string", example="1|57653vtZoT9EW2iRBHShQyALGaeZ3PtrtPhUN6Arlpgc4fe5fe8"),
     *        ),
     *     ),
     *
     * )
     */
    public function store(StoreUserRequest $request)
    {
        //

        $register = (new StaffService)->RegisterStaff($request);

        if ($register) {
            //send mail to the staff
            Mail::to($request->email)->send(new RegisterMail($register));

            return response()->json([
                "status" => "success",
                "message" => "Register Successfully",
                "user" => StoreUserResource::make($register),
                "token" => $register->createToken("API TOKEN")->plainTextToken
            ], 200);
        }
        return response()->json([
            "status" => "success",
            "message" => "Register Successfully",
            "user" => StoreUserResource::make($register),
        ], 200);
    }



    /**
     * Show  User
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
     *         response="401",
     *         description="You dont Have Permission",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="You dont Have Permission"),
     *         )
     *     ),
     *     @OA\Response(
     *         response="404",
     *         description="Not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="No Staff found"),
     *         )
     *     ),
     * )
     */
    public function show(User $staff)
    {

        if (Auth::user()->role_id == 1) {

            if ($staff) {
                return response()->json([
                    "status" => "success",
                    "data" =>  ShowUserResource::make($staff)
                ], 200);
            }

            return response()->json([
                "status" => "error",
                "message" => "No Staff Found",
            ], 404);
        }

        return response()->json([
            "status" => "error",
            "message" => "You dont Have Permission",
        ], 401);
    }



    /**
     * Update the staff details.
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
     *                 ),
     *                 example={
     *                     "name":"example name",
     *                     "email":"example email",
     *                     "phone":"example phone",
     *                     "zone":"example zone"
     *                }
     *             )
     *         )
     *      ),
     *     @OA\Response(
     *         response="200",
     *         description="Update Successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Update Successfully"),
     *             @OA\Property(property="user", type="object",
     *                 @OA\Property(property="id", type="integer", example=9),
     *                 @OA\Property(property="name", type="string", example="abc kel"),
     *                 @OA\Property(property="email", type="string", example="abc@example2.com"),
     *                 @OA\Property(property="phone", type="string", example="65728338352"),
     *                 @OA\Property(property="zone", type="string", example="nigeria"),
     *                 @OA\Property(property="role", type="object",
     *                     @OA\Property(property="id", type="integer", example=2),
     *                     @OA\Property(property="name", type="string", example="Admin"),
     *                 ),
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
     *                  @OA\Property(property="name", type="string", example="name is required"),
     *                  @OA\Property(property="email", type="string", example="email is required"),
     *                  @OA\Property(property="phone", type="string", example="phone is required"),
     *                  @OA\Property(property="zone", type="string", example="zone is required"),
     *             ),
     *         )
     *     ),
     *     @OA\Response(
     *         response="401",
     *         description="Credential error",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Credential error: You are not authorize"),
     *         )
     *     ),
     *
     * )
     *
     *
     *
     *
     */

    public function update(Request $request, User $staff)
    {


        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string'],
            'phone' => ['required', 'string', 'min:11'],
            'zone' => ['required', 'string', 'max:255'],
        ]);


        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => "All fields are required ",
                "data" => $validator->errors()
            ], 400);
        }

        $update = (new StaffService)->updateStaff($request, $staff);
        if ($update) {
            return response()->json([
                'status' => 'error',
                'message' => "All fields are required ",
                "data" => new ShowUserResource($update)
            ], 200);
        }

        return response()->json([
            "status" => "error",
            "message" => "Credential error: You are not authorize",
        ], 401);
    }

    /**
     * Delete Staff
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
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Staff deleted successfully"),
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
    public function destroy(User $user)
    {
        if (Auth::user()->role_id == 1) {

            if ($user->delete()) {
                return response()->json([
                    "status" => "success",
                    "message" => "Staff deleted successfully",
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
