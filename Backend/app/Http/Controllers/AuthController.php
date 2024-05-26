<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Service\AuthService;
use Illuminate\Http\Request;
use App\Service\StaffService;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\LoginResource;
use App\Http\Requests\LoginUserRequest;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\StaffStorePasswordRequest;

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
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/LoginResource")
     *         ),
     *     ),
     *     @OA\Response(
     *         response="400",
     *         description="All Fields are Required",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="ensure that all required filed are properly filled"),
     *         )
     *     ),
     *     @OA\Response(
     *         response="401",
     *         description="Credential not match",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Credential not match"),
     *         )
     *     ),
     *
     * )
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => "ensure that all required filed are properly filled ",
                "data" => $validator->errors()
            ], 400);
        }

        $login = (new AuthService)->LoginStaff($request);
        if ($login) {
            return new LoginResource($login);
        }

        return response()->json([
            "status" => "error",
            "message" => "Credential not match",
        ], 401);
    }



    /**
     * @OA\Post(
     *     path="/api/auth/store-password",
     *     tags={"Authentication"},
     *     summary="Staff Create Password",
     *     description="This allow the staff to create new password to  login to there account",
     *     operationId="createStaffPassword",  
     *     @OA\RequestBody(
     *          @OA\JsonContent(),
     *          @OA\MediaType(
     *              mediaType="multipart/form-data",
     *          @OA\Schema(
     *              type="object",
     *              required={"password","password_confirmation"},
     *              @OA\Property(property="user", description="the staff id", type="string", example="1"),
     *              @OA\Property(property="token", description="token sent in the mail", type="string", example="djhsdjgjJHjhjffH"),
     *              @OA\Property(property="password", description="Enter new password", type="password", example="12345678"),
     *              @OA\Property(property="password_confirmation", description="Confirm password", type="password", example="12345678"),
     *          ),
     *         ),
     *     ),
     *     @OA\Response(
     *         response="200",
     *         description="Password Created Successfull",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Password Created Successfull"),
     *         )
     *     ),
     *     @OA\Response(
     *         response="401",
     *         description="Invalid Token",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Invalid Password Token"),
     *         )
     *     ),
     *
     * )
     */

    public function storePassword(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'password' => 'required|string|confirmed|min:8',
            'user' => 'required',
            'token' => 'required'
        ]);


        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => "All fields are required ",
                "data" => $validator->errors()
            ], 403);
        }

        $savePassword = (new StaffService)->storePassword($request);

        if ($savePassword) {
            return response()->json([
                'status' => 'success',
                'message' => 'Password Created successful'
            ], 200);
        }
        return response()->json([
            'status' => 'error',
            'message' => 'Something went wrong'
        ],  400);
    }
}
