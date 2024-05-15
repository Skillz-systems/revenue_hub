<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'pid',
        'occupant',
        'prop_addr',
        'street_name',
        'asset_no',
        'cadastral_zone',
        'prop_type',
        'prop_use',
        'rating_dist',
        'annual_value',
        'rate_payable',
        //'arrears',
        //'penalty',
        'grand_total',
        'category',
        'group',
        'active',
    ];


    public const PENALTY = 10;
}
