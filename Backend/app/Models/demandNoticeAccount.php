<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemandNoticeAccount extends Model
{
    use HasFactory;
    protected $fillable = [
        "demand_notice_id",
        "tx_ref",
        "account_number",
        "account_name",
        "account_bank_name",
        "account_email",
        "amount",
    ];
}
