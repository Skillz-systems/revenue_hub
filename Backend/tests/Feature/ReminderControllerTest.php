<?php

namespace Tests\Feature;

use App\Models\DemandNotice;
use App\Models\DemandNoticeReminder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use Tests\TestCase;
use Carbon\Carbon;

class ReminderControllerTest extends TestCase
{
    use RefreshDatabase;

    // Test successful creation of a reminder
    public function test_create_reminder_successful()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
    
        $demandNotice = DemandNotice::factory()->create(['status' => 0]);
    
        $response = $this->postJson(route('createReminder', ['demandNoticeId' => $demandNotice->id]));
    
        $response->assertStatus(201)
            ->assertJson([
                'status' => 'success',
                'message' => 'Reminder created successfully',
            ]);
    
        $this->assertDatabaseHas('demand_notice_reminders', [
            'demand_notice_id' => $demandNotice->id,
        ]);
    }

    // Test failure when trying to create a reminder for a paid demand notice
    public function test_create_reminder_fails_for_paid_demand_notice()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $demandNotice = DemandNotice::factory()->create(['status' => 1]);

        $response = $this->postJson(route('createReminder', ['demandNoticeId' => $demandNotice->id]));

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'Cannot create reminder. Either demand notice does not exist or payment has been made.',
            ]);

        $this->assertDatabaseMissing('demand_notice_reminders', [
            'demand_notice_id' => $demandNotice->id,
        ]);
    }

    // Test failure when trying to create a reminder for a non-existent demand notice
    public function test_create_reminder_fails_for_non_existent_demand_notice()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $response = $this->postJson(route('createReminder', ['demandNoticeId' => 999]));

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'Cannot create reminder. Either demand notice does not exist or payment has been made.',
            ]);
    }

    public function test_view_demand_notice_with_latest_reminder()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
    
        // Create a demand notice
        $demandNotice = DemandNotice::factory()->create();
    
        // Assert demand notice exists
        $this->assertDatabaseHas('demand_notices', ['id' => $demandNotice->id]);
    
        // Create a reminder associated with the demand notice
        $reminder = DemandNoticeReminder::factory()->create([
            'demand_notice_id' => $demandNotice->id,
            'created_at' => Carbon::now()->subDays(5),
        ]);
    
        // Act: Make a request to view the demand notice
        $response = $this->getJson(route('viewReminder', ['demandNoticeId' => $demandNotice->id]));
    
        // Assert: Check the response
        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'id' => $demandNotice->id,
                    'latest_reminder_date' => $reminder->created_at->toDateTimeString(),
                ],
            ]);
    }
    

    public function test_view_demand_notice_without_reminders()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        // Create a demand notice
        $demandNotice = DemandNotice::factory()->create();

        // Act: Make a request to view the demand notice
        $response = $this->getJson(route('viewReminder', ['demandNoticeId' => $demandNotice->id]));

        // Assert: Check the response
        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'id' => $demandNotice->id,
                    'latest_reminder_date' => null,
                ],
            ]);
    }

    public function test_view_demand_notice_not_found()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        // Act: Make a request to view a non-existent demand notice
        $response = $this->getJson(route('viewReminder', ['demandNoticeId' => 999]));

        // Assert: Check the response
        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'Demand notice not found.',
            ]);
    }
}