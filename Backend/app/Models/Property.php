<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;
    const STATUS_Regular = 1;
    protected $fillable = [
        'pid',
        'occupant',
        'prop_addr',
        'street_id',
        'asset_no',
        'cadastral_zone_id',
        'property_type_id',
        'property_use_id',
        'rating_district_id',
        'annual_value',
        'rate_payable',
        //'arrears',
        //'penalty',
        'grand_total',
        'category_id',
        'group_id',
        'active',
    ];


    public const PENALTY = 10;

    public function demandNotices()
    {
        return $this->hasMany(DemandNotice::class);
    }

    public function street()
    {
        return $this->belongsTo(Street::class);
    }
    public function cadastralZone()
    {
        return $this->belongsTo(CadastralZone::class);
    }

    public function propertyType()
    {
        return $this->belongsTo(PropertyType::class);
    }

    public function propertyUse()
    {
        return $this->belongsTo(PropertyUse::class);
    }

    public function ratingDistrict()
    {
        return $this->belongsTo(RatingDistrict::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }
}
