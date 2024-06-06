<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RatingDistrict extends Model
{
    use HasFactory;

    protected $fillable = [
        "name",
        "office_zone_id",
    ];

    public function properties()
    {
        return $this->hasMany(Property::class);
    }
}
