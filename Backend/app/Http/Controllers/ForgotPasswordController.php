<?php

namespace App\Http\Controllers;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Validation\Rules\Password as RulesPassword;

// function to send password reset link
// the template for the email is located at app\Notification
// also the password request url is defined at \app\Models\User.php

class ForgotPasswordController extends Controller
{

/**
 * @OA\Info(
 *      version="1.0.0",
 *      title="Forgot Password API",
 *      description="forgot password functionality",
 *    
 *      @OA\Contact(
 *          email="your_email@example.com"
 *      )
 * )
 *
 * @OA\Post(
 *     path="api/forgot-password",
 *     tags={"Authentication"},
 *     summary="Send reset password link",
 *     description="This endpoint allows users to request a password reset link by providing their email address.",
 *     consumes={"application/json"},
 *     produces={"application/json"},
 *     @OA\Parameter(
 *         name="email",
 *         in="formData",
 *         description="User's email address",
 *         required=true,
 *         @OA\Schema(
 *             type="string",
 *             format="email"
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="We have emailed your password reset link",
 *         @OA\JsonContent(
 *             @OA\Property(
 *                 property="status",
 *                 type="string",
 *                 description="Message indicating the status of the reset password link sent."
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Validation error",
 *         @OA\JsonContent(
 *             @OA\Property(
 *                 property="message",
 *                 type="string",
 *                 description="Error message indicating validation failure."
 *             )
 *         )
 *     )
 * )
 */

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status == Password::RESET_LINK_SENT) {
            return [
                'status' => __($status)
            ];
        }
    
    }

    // function to reset the password 
    // this function accept "token", "email", "password", "password_confirmation" as json then 
    // when the password reset is successful the token is going to be removed from the database 
    public function reset(Request $request)
    {
       /**
 * @OA\Post(
 *     path="api/reset-password",
 *     tags={"Authentication"},
 *     summary="Reset Password",
 *     description="This endpoint allows users to reset their password by providing a valid token, email, and new password.",
 *     requestBody={
 *         required=true,
 *         description="User's email, reset token, and new password",
 *         content={
 *             "application/json": {
 *                 schema={
 *                     required={"token", "email", "password", "password_confirmation"},
 *                     properties={
 *                         token={type="string", description="The reset token received via email", example="abcdef123456"},
 *                         email={type="string", format="email", description="User's email address", example="user@example.com"},
 *                         password={type="string", format="password", description="New password", example="new_password123"},
 *                         password_confirmation={type="string", format="password", description="Confirmation of new password", example="new_password123"}
 *                     }
 *                 }
 *             }
 *         }
 *     },
 *     @OA\Response(
 *         response=200,
 *         description="Password reset successfully",
 *         @OA\JsonContent(
 *             @OA\Property(
 *                 property="message",
 *                 type="string",
 *                 example="Password reset successfully"
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
 *                 example="Something went wrong"
 *             )
 *         )
 *     )
 * )
 */
 
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', RulesPassword::defaults()],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                    'remember_token' => Str::random(60),
                ])->save();

                $user->tokens()->delete();

                event(new PasswordReset($user));
            }
        );

        if ($status == Password::PASSWORD_RESET) {
            return response([
                'message'=> 'Password reset successfully'
            ]);
        }

        return response([
            'message'=> __($status)
        ], 500);

    }

}