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
        "flw_ref",
        "demand_notice_id",
        "actual_amount",
        "charged_amount",
        "app_fee",
        "merchant_fee",
        "status",
        "webhook_string",
    ];

    public function demandNotice()
    {
        return $this->hasOne(DemandNotice::class, "id", "demand_notice_id");
    }
}
