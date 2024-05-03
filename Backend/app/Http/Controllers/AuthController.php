<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\StaffStorePasswordRequest;
use App\Models\User;
use App\Service\AuthService;
use App\Service\StaffService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/auth/login",
     *     tags={"Authentication"},
     *     summary="Staff Login",
     *     description="This allow the staff to login to there account.",
     *     operationId="loginStaff",    
     *     @OA\RequestBody(
     *          @OA\JsonContent(),
     *          @OA\MediaType(
     *          mediaType="multipart/form-data",
     *          @OA\Schema(
     *          type="object",
     *          required={"email","password"},
     *          @OA\Property(property="email", description="Enter staff email", type="text", example="admin@revenuehub.com"),
     *          @OA\Property(property="password", description="Enter staff password", type="password", example="12345678"),
     *          ),
     *         ),
     *     ),
     *     @OA\Response(
     *         response="200",
     *         description="Login Successful",
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
     )
     *     ),
     *     @OA\Response(
     *         response="401",
     *         description="Credential not match",
     *     ),
     *
     * )
     */
    public function login(LoginUserRequest $request)
    {

        //$login = (new AuthService)->LoginStaff($request);

        //return $login;
    }



    /**
     *  Staff create new password
     *
     * @OA\Post(
     *     path="/api/auth/store-password/?user&?token",
     *     tags={"Authentication"},
     *     summary="Staff Create Password",
     *     description="This allow the staff to create new password to  login to there account",
     *     operationId="createStaffPassword",
     *     @OA\Parameter(
     *         in="query",
     *         name="user",
     *         required=false,
     *         description="staff id",
     *         @OA\Schema(type="text")
     *     ),
     *     @OA\Parameter(
     *         in="query",
     *         name="token",
     *         required=false,
     *         description="staff password token send to the email",
     *         @OA\Schema(type="text")
     *     ),   
     *     @OA\RequestBody(
     *          @OA\JsonContent(),
     *          @OA\MediaType(
     *          mediaType="multipart/form-data",
     *          @OA\Schema(
     *          type="object",
     *          required={"password","password_confirmation"},
     *          @OA\Property(property="password", description="Enter new password", type="password", example="12345678"),
     *          @OA\Property(property="password_confirmation", description="Confirm password", type="password", example="12345678"),
     *          ),
     *         ),
     *     ),
     *     @OA\Response(
     *         response="200",
     *         description="Password Created Successfull",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Password Created Successfull"),
     *         )
     *     ),
     *     @OA\Response(
     *         response="401",
     *         description="Invalid Token",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Invalid Password Token"),
     *         )
     *     ),
     *
     * )
     */

    public function storePassword(Request $request)
    {
        $savePassword = (new StaffService)->strorePassword($request);

        return $savePassword;
    }
}
