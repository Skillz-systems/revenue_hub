<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemandNoticeReminder extends Model
{
    use HasFactory;

    protected $fillable = [
        'demand_notice_id',
    ];
    public function reminder()
    {
        return $this->hasOne(DemandNoticeReminder::class);
    }
}
