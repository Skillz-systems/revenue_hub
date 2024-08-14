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
    public function test_create_reminder_successful()
    {
        // Create a user and authenticate
        $user = User::factory()->create();
        $this->actingAs($user);
    
        // Create a demand notice with status 0 (not paid)
        $demandNotice = DemandNotice::factory()->create(['status' => 0]);
    
        // Act: Make a request to create a reminder
        $response = $this->postJson(route('createReminder', ['demandNoticeId' => $demandNotice->id]));
    
        // Assert: Check the response
        $response->assertStatus(201)
            ->assertJson([
                'status' => 'success',
                'message' => 'Reminder created successfully',
            ]);
    
        // Assert: Check the reminder is stored in the database
        $this->assertDatabaseHas('demand_notice_reminders', [
            'demand_notice_id' => $demandNotice->id,
        ]);
    }
    
    
    

    


    public function test_create_reminder_fails_for_paid_demand_notice()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        // Create a demand notice with status 1 (paid)
        $demandNotice = DemandNotice::factory()->create(['status' => 1]);

        // Act: Try to create a reminder
        $response = $this->postJson(route('createReminder', ['demandNoticeId' => $demandNotice->id]));

        // Assert: Check the response
        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'Cannot create reminder. Either demand notice does not exist or payment has been made.',
            ]);

        // Assert: No reminders should be created
        $this->assertDatabaseMissing('demand_notice_reminders', [
            'demand_notice_id' => $demandNotice->id,
        ]);
    }

    public function test_create_reminder_fails_for_non_existent_demand_notice()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        // Act: Try to create a reminder for a non-existent demand notice
        $response = $this->postJson(route('createReminder', ['demandNoticeId' => 999]));

        // Assert: Check the response
        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'Cannot create reminder. Either demand notice does not exist or payment has been made.',
            ]);
    }
}

