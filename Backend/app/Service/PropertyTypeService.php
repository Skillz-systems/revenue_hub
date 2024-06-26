<?php

namespace App\Service;
<<<<<<< HEAD

=======
>>>>>>> 7030308 (crud for property type)
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
<<<<<<< HEAD
    public function getAllPropertyType()
=======
    public function getAllPropertyType ()
>>>>>>> 7030308 (crud for property type)
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
<<<<<<< HEAD
        if ($updateData) {
            return $updateData->update($data);
        } else {
            throw new \Exception("Property type not found with ID: $id");
        }
=======
        return $updateData->update($data);
>>>>>>> 7030308 (crud for property type)
    }

    public function deletePropertyType($id)
    {
        $delete = $this->getPropertyTypeById($id);
<<<<<<< HEAD
        if ($delete) {
            return $delete->delete();
        } else {
            throw new \Exception("Property type not found with ID: $id");
        }
=======
        return $delete->delete();
>>>>>>> 7030308 (crud for property type)
    }


    public function checkIsAdminOrMd()
    {
        if (Auth::user()->role_id == User::ROLE_ADMIN || Auth::user()->role_id == User::ROLE_MD) {
            return true;
        }

        return false;
    }
}
