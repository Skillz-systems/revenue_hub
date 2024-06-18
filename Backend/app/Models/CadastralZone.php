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


    public function rating_district()
    {
        return $this->belongsTo(RatingDistrict::class, 'rating_district_id');
    }
}
