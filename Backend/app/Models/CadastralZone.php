<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CadastralZone extends Model
{
    use HasFactory;

    protected $fillable = [
        "name",
        "rating_district_id",
    ];
}
