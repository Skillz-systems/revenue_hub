<?php

namespace App\Service;

use App\Models\Group;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;

class GroupService
{
    public function create($data)
    {
        return Group::create($data);
    }

    public function getGroupFromGroupName($name)
    {
        return Group::where('name', $name)->first();
    }
}
