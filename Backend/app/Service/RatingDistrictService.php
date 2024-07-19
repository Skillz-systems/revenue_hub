<?php

namespace App\Service;

use App\Models\User;
use App\Models\RatingDistrict;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;

class RatingDistrictService
{
    public function getAllRatingDistrict()
    {
        return RatingDistrict::all();
    }

    public function create($data)
    {
        return RatingDistrict::create($data);
    }

    public function getRatingDistrictFromDistrictName($name)
    {
        return RatingDistrict::where('name', $name)->first();
    }

    public function getRatingDistrictById($id)
    {
        return RatingDistrict::where('id', $id)->first();
    }

    public function updateRatingDistrict($data, $id)
    {
        $updateData = $this->getRatingDistrictById($id);
        if ($updateData) {
            return $updateData->update($data);
        } else {
            throw new \Exception ("Rating District not found with ID: $id");
        }
    }

    public function deleteRatingDistrict($id)
    {
        $delete = $this->getRatingDistrictById($id);
        if ($delete) {
            return $delete->delete();
        } else {
            throw new \Exception ("Rating District not found with ID: $id");
        }
    }


    public function checkIsAdminOrMd()
    {
        if (Auth::user()->role_id == User::ROLE_ADMIN || Auth::user()->role_id == User::ROLE_MD) {
            return true;
        }

        return false;
    }
}
