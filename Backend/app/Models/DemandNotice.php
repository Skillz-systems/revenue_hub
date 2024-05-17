<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemandNotice extends Model
{
    use HasFactory;

    protected $fillable = ['property_id', 'status', 'date_issued'];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
