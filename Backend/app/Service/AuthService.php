<?php

namespace App\Service;

use App\Http\Resources\StoreUserResource;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthService
{

    public function LoginStaff($request)
    {
        $request->validated($request->all());

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                "status" => "error",
                "message" => "Credential not match",
            ], 401);
        }

        $user = User::where('email', $request->email)->first();
        return $user;
    }
}
