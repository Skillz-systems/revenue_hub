<?php

namespace App\Http\Controllers;

use App\Models\DemandNotice;
use App\Models\DemandNoticeReminder;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ReminderController extends Controller
{
    public function createReminder($demandNoticeId)
{
    $demandNotice = DemandNotice::find($demandNoticeId);

    if ($demandNotice && $demandNotice->status == 0) {

        $lastReminderCreatedAt = $demandNotice->reminders()
            ->latest('created_at')
            ->value('created_at');

        if ($lastReminderCreatedAt && Carbon::parse($lastReminderCreatedAt)->greaterThanOrEqualTo(Carbon::now()->subDays(28))) {
            return response()->json([
                'status' => 'error',
                'message' => 'A reminder has already been created within the last 28 days',
            ], 400);
        }

        $reminder = DemandNoticeReminder::create([
            'demand_notice_id' => $demandNotice->id,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Reminder created successfully',
            'data' => $reminder,
        ], 201);
    }

    return response()->json([
        'status' => 'error',
        'message' => 'Cannot create reminder. Either demand notice does not exist or payment has been made.',
    ], 400);
}

}   
