<?php

namespace App\Service;

use App\Models\Category;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;

class CategoryService
{
    public function create($data)
    {
        return Category::create($data);
    }

    public function getCategoryFromCategoryName($name)
    {
        return Category::where('name', $name)->first();
    }
}
