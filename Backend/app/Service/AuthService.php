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
        if ($result = !Auth::attempt($request->only('email', 'password'))) {
            return false;
        }


        $user = User::where('email', $request->email)->first();
        return $user;
    }
}
