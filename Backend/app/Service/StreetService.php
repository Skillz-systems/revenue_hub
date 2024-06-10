<?php

namespace App\Service;


use App\Models\User;
use App\Models\Street;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class StreetService
{

    public function getAllStreet()
    {
        return Street::all();
    }
    public function create($data)
    {
        return Street::create($data);
    }

    public function getStreetFromStreetName($name)
    {
        return Street::where('name', $name)->first();
    }

    public function getStreetById($id)
    {
        return Street::where('id', $id)->first();
    }

    public function updateStreet($request, $street)
    {
        if ($update = $this->getStreetById($street)) {

            if ($update->update($request->all())) {
                return $street;
            }

            return false;
        }

        return false;
    }

    public function deleteStreet($street)
    {
        if ($delete = $this->getStreetById($street)) {

            if ($delete->delete()) {
                return true;
            }

            return false;
        }

        return false;
    }


    public function checkIsAdminOrMd()
    {
        if (Auth::user()->role_id == User::ROLE_ADMIN || Auth::user()->role_id == User::ROLE_MD) {
            return true;
        }
    }
}
