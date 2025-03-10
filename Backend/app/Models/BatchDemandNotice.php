<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BatchDemandNotice extends Model
{
    use HasFactory;

    protected $fillable = [
        "rating_district_id",
        "cadastral_zone_id",
        "street_id",
    ];

    public function street()
    {
        return $this->belongsTo(Street::class);
    }
}
