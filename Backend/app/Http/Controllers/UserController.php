<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Models\User;
use App\Service\AuthService;
use App\Service\StaffService;
use Illuminate\Http\Request;

class UserController extends Controller
{

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

        return $register;
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
