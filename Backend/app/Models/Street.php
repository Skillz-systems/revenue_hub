<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Street extends Model
{
    use HasFactory;
    protected $fillable = [
        "name",
        "cadastral_zone_id",
    ];


    public function cadastralZone()
    {
        return $this->belongsTo(CadastralZone::class, 'cadastral_zone_id');
    }

    public function properties()
    {
        return $this->hasMany(Property::class);
    }
}
