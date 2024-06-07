<?php

namespace App\Service;

use App\Models\CadastralZone;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;

class CadastralZoneService
{
    public function create($data)
    {
        return CadastralZone::create($data);
    }

    public function getCadastralZoneFromZoneName($name)
    {
        return CadastralZone::where('name', $name)->first();
    }
}
