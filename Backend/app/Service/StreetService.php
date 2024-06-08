<?php

namespace App\Service;


use App\Models\Street;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;

class StreetService
{
    public function create($data)
    {
        return Street::create($data);
    }

    public function getStreetFromStreetName($name)
    {
        return Street::where('name', $name)->first();
    }
}
