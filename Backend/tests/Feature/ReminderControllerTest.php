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
}

