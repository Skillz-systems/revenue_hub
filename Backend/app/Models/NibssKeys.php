<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NibssKeys extends Model
{
    use HasFactory;
    protected $fillable = [
        "key_name",
        "key"
    ];
}
