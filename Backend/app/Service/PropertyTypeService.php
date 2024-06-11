<?php

namespace App\Service;
use App\Models\User;
use App\Models\Property;
use App\Models\PropertyType;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;

class PropertyTypeService
{
    public function getAllPropertyType ()
    {
        return PropertyType::all();
    }

    public function create($data)
    {
        return PropertyType::create($data);
    }

    public function getPropertyTypeFromPropertyTypeName($name)
    {
        return PropertyType::where('name', $name)->first();
    }

    public function getPropertyTypeById($id)
    {
        return PropertyType::where('id', $id)->first();
    }

    public function updatePropertyType($data, $id)
    {
        $updateData = $this->getPropertyTypeById($id);
        return $updateData->update($data);
    }

    public function deletePropertyType($id)
    {
        $delete = $this->getPropertyTypeById($id);
        return $delete->delete();
    }


    public function checkIsAdminOrMd()
    {
        if (Auth::user()->role_id == User::ROLE_ADMIN || Auth::user()->role_id == User::ROLE_MD) {
            return true;
        }

        return false;
    }
}
