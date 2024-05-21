<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemandNotice extends Model
{
    use HasFactory;
    public const PENDING = 0;
    protected $fillable = [
        "property_id",
        "amount",
        "arrears_amount",
        "penalty",
        "status",
    ];

    public function property()
    {
        return $this->hasOne(Property::class, "id", "property_id");
    }
}
