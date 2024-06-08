<?php

namespace App\Service;

use App\Models\PropertyUse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;

class PropertyUseService
{
    public function create($data)
    {
        return PropertyUse::create($data);
    }

    public function getPropertyUseFromPropertyUseName($name)
    {
        return PropertyUse::where('name', $name)->first();
    }
}
