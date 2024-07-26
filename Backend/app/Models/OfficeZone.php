<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OfficeZone extends Model
{
    use HasFactory;


    protected $fillable = [
        'name',
        'address'
    ];

    public function ratingDistrict()
    {
        return $this->hasMany(RatingDistrict::class);
    }
}
