<?php

namespace App\Service;

use App\Http\Requests\StaffStorePasswordRequest;
use App\Models\User;
use App\Mail\RegisterMail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Http\Resources\StoreUserResource;
use Illuminate\Support\Facades\Hash;

class StaffService
{
    public function RegisterStaff($request)
    {
        // validate staff inputs
        $request->validated($request->all());

        // save the staff data
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'zone' => $request->zone,
            'role_id' => $request->role_id,
            'remember_token' => Str::random(25),
        ]);

        //send mail to the staff
        Mail::to($request->email)->send(new RegisterMail($user));

        return response()->json([
            "status" => "success",
            "message" => "Register Successfully",
            "user" => StoreUserResource::make($user),
            "token" => $user->createToken("API TOKEN")->plainTextToken
        ], 200);
    }


    /**
     *@param mixed $request
     */
    public function strorePassword($request)
    {
        // validet the data
        $request->validate(
            [
                'password' => 'required|string|confirmed|min:8'
            ]
        );

        // get the user using the id and remember)_token
        $user = User::where('id', $request->query('user'))->where('remember_token', $request->query('token'))->first();

        // checking if the user and token exit 
        if ($user) {
            $user->update([
                'password' => Hash::make($request->password),
                'remember_token' => null,
                'email_verified_at' => now(),
            ]);
            return response()->json([
                'status' => 'success',
                'message' => 'Password Created successful'
            ], 200);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid Password Token'
            ], 401);
        }

        //return true;
    }
}
