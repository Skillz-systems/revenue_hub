<?php

namespace App\Service;

use App\Models\Group;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;

class GroupService
{
    public function getAllGroup()
    {
        return Group::all();
    }

    public function create($data)
    {
        return Group::create($data);
    }

    public function getGroupFromGroupName($name)
    {
        return Group::where('name', $name)->first();
    }

    public function getGroupById($id)
    {
        return Group::where('id', $id)->first();
    }

    public function updateGroup($data, $id)
    {
        $updateData = $this->getGroupById($id);
        if ($updateData) {
            return $updateData->update($data);
        } else {
            throw new \Exception ("Group not found with ID: $id");
        }
    }

    public function deleteGroup($id)
    {
        $delete = $this->getGroupById($id);
        if ($delete) {
            return $delete->delete();
        } else {
            throw new \Exception ("Group not found with ID: $id");
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