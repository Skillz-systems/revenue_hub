<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;
    protected $fillable =
    [
        "tx_ref",
        "demand_notice_id",
        "actual_amount",
        "charged_amount",
        "app_fee",
        "merchant_fee",
        "status",
        "webhook_string",
    ];
}
