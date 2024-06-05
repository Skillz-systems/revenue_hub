<?php

namespace App\Service;

use App\Models\RatingDistrict;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;

class RatingDistrictService
{
    public function create($data)
    {
        return RatingDistrict::create($data);
    }

    public function geRatingDistrictFromDistrictName($name)
    {
        return RatingDistrict::where('name', $name)->first();
    }
}
