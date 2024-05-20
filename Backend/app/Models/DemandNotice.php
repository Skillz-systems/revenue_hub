<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemandNotice extends Model
{
    use HasFactory;
    protected $fillable = [
        "property_id",
        "amount"
    ];

    public function property()
    {
        return $this->hasOne(Property::class, "id", "property_id");
    }
}
