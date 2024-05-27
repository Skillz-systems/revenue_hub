<?php

namespace App\Service;

use App\Models\User;
use App\Mail\RegisterMail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Http\Resources\StoreUserResource;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;

class StaffService
{
    public function RegisterStaff($request)
    {
        $request->all()['remember_token'] = Str::random(60);
        $user = User::create($request->all());
        return $user;
    }

    /**
     *@param mixed $request
     */
    public function storePassword($request)
    {
        // get the user using the id and remember)_token
        $user = User::where(['id' => $request->user, 'remember_token' => $request->token])->first();

        // checking if the user and token exit 
        if ($user) {
            $createPassword = $user->update([
                'password' => Hash::make($request->password),
                'remember_token' => null,
                'email_verified_at' => now(),
            ]);
            if ($createPassword) {
                return $createPassword;
            }
        }
        return false;
    }


    function updateStaff($request, $user)
    {
        $updateDetail = $this->viewStaff($user);
        $updateStaff = $updateDetail->update($request->all());

        if ($updateStaff) {
            return $updateStaff;
        }

        return false;
    }

    public function deleteStaff($user)
    {
        $getStaff = $this->viewStaff($user);
        if ($getStaff) {
            return $getStaff->delete();
        }
        return false;
    }

    public function viewStaff($user)
    {
        try {
            return  User::findOrFail($user);
        } catch (ModelNotFoundException) {

            return false;
        }
    }


    public function viewAllStaff()
    {
        return User::all();
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
