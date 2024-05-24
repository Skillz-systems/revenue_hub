<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class StaffControllerTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    use RefreshDatabase;

    // public function test_index_returns_staff_members()
    // {
    //     // Arrange
    //     $staff = User::factory()->count(5)->create(); // Assuming you have a User factory

    //     // Mock the StaffService
    //     $staffServiceMock = Mockery::mock(StaffService::class);
    //     $staffServiceMock->shouldReceive('viewAllStaff')
    //         ->once()
    //         ->andReturn($staff);

    //     $this->app->instance(StaffService::class, $staffServiceMock);

    //     // Act
    //     $response = $this->actingAsTestUser()->getJson('/api/staff');

    //     // Assert
    //     $response->assertStatus(200)
    //         ->assertJson([
    //             'status' => 'success',
    //         ]);
    //     // ->assertJsonStructure([
    //     //     'data' => [
    //     //         '*' => ['id', 'name', 'email', /* other user attributes */]
    //     //     ],
    //     // ]);
    // }

    // public function test_index_returns_no_staff_found()
    // {
    //     // Arrange
    //     // Mock the StaffService
    //     $staffServiceMock = Mockery::mock(StaffService::class);
    //     $staffServiceMock->shouldReceive('viewAllStaff')
    //         ->once()
    //         ->andReturn(null);

    //     $this->app->instance(StaffService::class, $staffServiceMock);

    //     // Act
    //     $response = $this->getJson('/api/staff');

    //     // Assert
    //     $response->assertStatus(404)
    //         ->assertJson([
    //             'status' => 'error',
    //             'message' => 'No Staff found',
    //         ]);
    // }
}
