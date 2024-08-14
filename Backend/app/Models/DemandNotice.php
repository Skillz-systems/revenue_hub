<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemandNotice extends Model
{
    use HasFactory;
    public const PENDING = 0;
    public const PAID = 1;
    protected $fillable = [
        "property_id",
        "amount",
        "arrears_amount",
        "penalty",
        "status",
        "created_at",
        "updated_at",
    ];

    public function property()
    {
        return $this->hasOne(Property::class, "id", "property_id");
    }
    public function payments()
    {
        return $this->hasMany(Payment::class, "id", "demand_notice_id");
    }
    public function reminders()
    {
        return $this->hasMany(DemandNoticeReminder::class, "id", "demand_notice_id");
    }
}
