<?php

namespace App\Service;

use App\Models\CadastralZone;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CadastralZoneService
{
    public function getAllCadastralZone()
    {
        return CadastralZone::all();
    }

    public function create($data)
    {
        return CadastralZone::create($data);
    }

    public function getCadastralZoneFromZoneName($name)
    {
        return CadastralZone::where('name', $name)->first();
    }

    public function getCadastralZoneById($id)
    {
        return CadastralZone::where('id', $id)->first();
    }

    public function updateCadastralZone($data, $id)
    {
        $updateData = $this->getCadastralZoneById($id);
        return $updateData->update($data);
    }

    public function deleteCadastralZone($id)
    {
        $delete = $this->getCadastralZoneById($id);
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
