<?php

namespace App\Http\Controllers;

use App\Models\DemandNotice;
use App\Models\DemandNoticeReminder;
use Illuminate\Http\Request;
use Carbon\Carbon;


/**
 * @OA\Post(
 *     path="/reminders/{demandNoticeId}/create",
 *     summary="Create a reminder for a demand notice",
 *     description="Creates a reminder for the specified demand notice if it is not paid and no reminder has been created within the last 28 days.",
 *     tags={"Reminders"},
 *     @OA\Parameter(
 *         name="demandNoticeId",
 *         in="path",
 *         required=true,
 *         description="ID of the demand notice to create a reminder for",
 *         @OA\Schema(
 *             type="integer"
 *         )
 *     ),
 *     @OA\RequestBody(
 *         required=false,
 *         @OA\JsonContent(
 *             @OA\Property(
 *                 property="demand_notice_id",
 *                 type="integer",
 *                 example=1,
 *                 description="ID of the demand notice"
 *             ),
 *             @OA\Property(
 *                 property="created_at",
 *                 type="string",
 *                 format="date-time",
 *                 example="2024-08-14T17:38:00Z",
 *                 description="Timestamp when the reminder was created"
 *             ),
 *             @OA\Property(
 *                 property="updated_at",
 *                 type="string",
 *                 format="date-time",
 *                 example="2024-08-14T17:38:00Z",
 *                 description="Timestamp when the reminder was last updated"
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Reminder created successfully",
 *         @OA\JsonContent(
 *             @OA\Property(
 *                 property="status",
 *                 type="string",
 *                 example="success"
 *             ),
 *             @OA\Property(
 *                 property="message",
 *                 type="string",
 *                 example="Reminder created successfully"
 *             ),
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *                 @OA\Property(
 *                     property="demand_notice_id",
 *                     type="integer",
 *                     example=1
 *                 ),
 *                 @OA\Property(
 *                     property="created_at",
 *                     type="string",
 *                     format="date-time",
 *                     example="2024-08-14T17:38:00Z"
 *                 ),
 *                 @OA\Property(
 *                     property="updated_at",
 *                     type="string",
 *                     format="date-time",
 *                     example="2024-08-14T17:38:00Z"
 *                 ),
 *                 @OA\Property(
 *                     property="id",
 *                     type="integer",
 *                     example=2
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Error in creating reminder",
 *         @OA\JsonContent(
 *             @OA\Property(
 *                 property="status",
 *                 type="string",
 *                 example="error"
 *             ),
 *             @OA\Property(
 *                 property="message",
 *                 type="string",
 *                 example="A reminder has already been created within the last 28 days"
 *             )
 *         )
 *     )
 * )
 */

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
