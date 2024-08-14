<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemandNoticeReminder extends Model
{
    use HasFactory;
    protected $fillable = [
        "demand_notice_id",
        "created_at",
        "updated_at",
    ];

    public function demandNotice()
    {
        return $this->belongsTo(DemandNotice::class,"id", "demand_notice_id");
    }
}
