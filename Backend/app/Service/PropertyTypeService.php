<?php

namespace App\Service;

use App\Models\PropertyType;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;

class PropertyTypeService
{
    public function create($data)
    {
        return PropertyType::create($data);
    }

    public function getPropertyTypeFromPropertyTypeName($name)
    {
        return PropertyType::where('name', $name)->first();
    }
}
