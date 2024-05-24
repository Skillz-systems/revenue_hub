<?php

namespace App\Service;

use App\Models\User;
use App\Mail\RegisterMail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Http\Resources\StoreUserResource;
use Illuminate\Support\Facades\Validator;

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

        return $user;
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


    function updateStaff($request, $user)
    {
        if (AUth::user()->id == $user->id) {
            $updateDetail = User::find($user->id);
            $updateDetail->update([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'zone' => $request->zone
            ]);

            return $updateDetail;
        }

        return false;
    }

    public function deleteStaff($user)
    {
        if (AUth::user()->id == $user->id) {
            $user->delete();
            return true;
        }
        return false;
    }

    public function viewStaff($user)
    {
        if (AUth::user()->id == $user->id) {
            return $user;
        }
        return false;
    }

    public function viewAllStaff()
    {
        return User::where('role_id', '>', 0)->get();
    }

    public function getAllStaffByRole($role)
    {
        return User::where('role_id', $role)->get();
    }

    public function getTotalNumberOfStaff()
    {
        return User::where('role_id', '>', 0)->count();
    }

    public function getTotalNumberOfStaffsByRole($role)
    {
        return User::where('role_id', $role)->count();
    }
}
