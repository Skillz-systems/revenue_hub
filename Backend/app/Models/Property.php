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
        return $this->belongsTo(Street::class, 'street_id');
    }
    public function cadastralZone()
    {
        return $this->belongsTo(CadastralZone::class, 'cadastral_zone_id');
    }

    public function propertyType()
    {
        return $this->belongsTo(PropertyType::class, 'property_type_id');
    }

    public function propertyUse()
    {
        return $this->belongsTo(PropertyUse::class, 'property_use_id');
    }

    public function ratingDistrict()
    {
        return $this->belongsTo(RatingDistrict::class, 'rating_district_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function group()
    {
        return $this->belongsTo(Group::class, 'group_id');
    }
}
