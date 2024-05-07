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
}
