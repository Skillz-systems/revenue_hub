<?php

namespace App\Service;

use App\Http\Resources\StoreUserResource;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthService
{

    public function LoginStaff($request)
    {
        // $request->validated($request->all())
        $user = User::where('email', $request->email)->first();
        if (Auth::attempt($request->only('email', 'password'))) {
            return $user;
        }

        return response()->json([
            "status" => "error",
            "message" => "Credential not match",
        ], 401);
    }
}
