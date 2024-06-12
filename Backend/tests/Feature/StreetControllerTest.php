<?php

namespace Tests\Feature;

use Mockery;
use Tests\TestCase;
use App\Models\Role;
use App\Models\User;
use App\Models\Street;
use App\Mail\RegisterMail;
use App\Service\StaffService;
use App\Service\StreetService;
use App\Mail\ForgotPasswordMail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class StreetControllerTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    use RefreshDatabase;

    protected $streetService;

    protected function setUp(): void
    {
        parent::setUp();

        // Mock the StreetService
        $this->streetService = $this->createMock(StreetService::class);
        $this->app->instance(StreetService::class, $this->streetService);
    }

    /** @test */
    public function it_returns_streets_if_user_is_admin_or_md()
    {
        // Assume the user is an admin or MD
        $this->streetService->method('checkIsAdminOrMd')->willReturn(true);

        // Assume the street service returns some streets
        $streets = Street::factory()->count(3)->make();
        $this->streetService->method('getAllStreet')->willReturn($streets);

        $response = $this->actingAsTestUser()
            ->getJson('/api/street');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ])
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'created_at', 'updated_at']
                ]
            ]);
    }

    /** @test */
    public function it_returns_error_if_no_streets_found()
    {
        // Assume the user is an admin or MD
        $this->streetService->method('checkIsAdminOrMd')->willReturn(true);

        // Assume the street service returns no streets
        $this->streetService->method('getAllStreet')->willReturn(null);

        $response = $this->actingAsTestUser()
            ->getJson('/api/street');

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'No Street found',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md()
    {
        // Assume the user is not an admin or MD
        $this->streetService->method('checkIsAdminOrMd')->willReturn(false);

        $response = $this->actingAsTestUser()
            ->getJson('/api/street');

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You dont Have Permission',
            ]);
    }

    /** @test */
    public function it_creates_a_street_if_user_is_admin_or_md_and_data_is_valid()
    {
        // Assume the user is an admin or MD
        $this->streetService->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the creation process
        $street = Street::factory()->make();
        $this->streetService->method('create')->willReturn($street);

        $data = [
            'name' => 'Test Street',
            'cadastral_zone_id' => 'Test Zone',
        ];

        $response = $this->actingAsTestUser()
            ->postJson('/api/street/create', $data);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ])
            ->assertJsonStructure([
                'data' => ['id', 'name', 'cadastral_zone_id', 'created_at', 'updated_at']
            ]);
    }

    /** @test */
    public function it_returns_error_if_street_creation_validation_fails()
    {
        // Assume the user is an admin or MD
        $this->streetService->method('checkIsAdminOrMd')->willReturn(true);

        $data = [
            'name' => '',  // Invalid data
            'cadastral_zone_id' => '',
        ];

        $response = $this->actingAsTestUser()
            ->postJson('/api/street/create', $data);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'All fields are required',
            ])
            ->assertJsonStructure(['data']);
    }

    /** @test */
    public function it_returns_error_if_street_creation_fails()
    {
        // Assume the user is an admin or MD
        $this->streetService->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the creation process to fail
        $this->streetService->method('create')->willReturn(null);

        $data = [
            'name' => 'Test Street',
            'cadastral_zone_id' => 'Test Zone',
        ];

        $response = $this->actingAsTestUser()
            ->postJson('/api/street/create', $data);

        $response->assertStatus(500)
            ->assertJson([
                'status' => 'error',
                'message' => 'An error occured',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_street_creation()
    {
        // Assume the user is not an admin or MD
        $this->streetService->method('checkIsAdminOrMd')->willReturn(false);

        $data = [
            'name' => 'Test Street',
            'cadastral_zone_id' => 'Test Zone',
        ];

        $response = $this->actingAsTestUser()
            ->postJson('/api/street/create', $data);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You dont Have Permission',
            ]);
    }

    /** @test */
    public function it_returns_a_street_if_user_is_admin_or_md_and_street_exists()
    {
        // Assume the user is an admin or MD
        $this->streetService->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the street
        $street = Street::factory()->make();
        $this->streetService->method('getStreetById')->willReturn($street);

        $response = $this->actingAsTestUser()
            ->getJson('/api/street/view/1');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ])
            ->assertJsonStructure([
                'data' => ['id', 'name', 'cadastral_zone_id', 'created_at', 'updated_at']
            ]);
    }

    /** @test */
    public function it_returns_error_if_street_not_found()
    {
        // Assume the user is an admin or MD
        $this->streetService->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the street not found
        $this->streetService->method('getStreetById')->willReturn(null);

        $response = $this->actingAsTestUser()
            ->getJson('/api/street/view/999');

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'No Street Found',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_view_street()
    {
        // Assume the user is not an admin or MD
        $this->streetService->method('checkIsAdminOrMd')->willReturn(false);

        $response = $this->actingAsTestUser()
            ->getJson('/api/street/view/1');

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You dont Have Permission',
            ]);
    }

    /** @test */
    public function it_updates_a_street_if_user_is_admin_or_md_and_data_is_valid()
    {
        // Assume the user is an admin or MD
        $this->streetService->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the update process
        $street = Street::factory()->create();
        $this->streetService->method('updateStreet')->willReturn(true);

        $data = [
            'name' => 'Updated Street Name',
            'cadastral_zone_id' => 'Updated Zone',
        ];

        $response = $this->actingAsTestUser()
            ->putJson('/api/street/update/' . $street->id, $data);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Street Updated successfully',
            ]);
    }

    /** @test */
    public function it_returns_error_if_validation_fails()
    {
        // Assume the user is an admin or MD
        $this->streetService->method('checkIsAdminOrMd')->willReturn(true);

        $data = [
            'name' => '',  // Invalid data
            'cadastral_zone_id' => '',
        ];

        $response = $this->actingAsTestUser()
            ->putJson('/api/street/update/1', $data);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'All fields are required',
            ])
            ->assertJsonStructure(['data']);
    }

    /** @test */
    public function it_returns_error_if_street_update_fails()
    {
        // Assume the user is an admin or MD
        $this->streetService->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the update process to fail
        $this->streetService->method('updateStreet')->willReturn(false);

        $street = Street::factory()->create();
        $data = [
            'name' => 'Updated Street Name',
            'cadastral_zone_id' => 'Updated Zone',
        ];

        $response = $this->actingAsTestUser()
            ->putJson('/api/street/update/' . $street->id, $data);

        $response->assertStatus(500)
            ->assertJson([
                'status' => 'error',
                'message' => 'An error occured',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_update_street()
    {
        // Assume the user is not an admin or MD
        $this->streetService->method('checkIsAdminOrMd')->willReturn(false);

        $street = Street::factory()->create();
        $data = [
            'name' => 'Updated Street Name',
            'cadastral_zone_id' => 'Updated Zone',
        ];

        $response = $this->actingAsTestUser()
            ->putJson('/api/street/update/' . $street->id, $data);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You dont Have Permission',
            ]);
    }

    /** @test */
    public function it_deletes_a_street_if_user_is_admin_or_md()
    {
        // Assume the user is an admin or MD
        $this->streetService->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the delete process
        $this->streetService->method('deleteStreet')->willReturn(true);

        $street = Street::factory()->create();

        $response = $this->actingAsTestUser()
            ->deleteJson('/api/street/delete/' . $street->id);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Street deleted successfully',
            ]);
    }

    /** @test */
    public function it_returns_error_if_street_deletion_fails()
    {
        // Assume the user is an admin or MD
        $this->streetService->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the delete process to fail
        $this->streetService->method('deleteStreet')->willReturn(false);

        $street = Street::factory()->create();

        $response = $this->actingAsTestUser()
            ->deleteJson('/api/street/delete/' . $street->id);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'An error occured',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_delete_street()
    {
        // Assume the user is not an admin or MD
        $this->streetService->method('checkIsAdminOrMd')->willReturn(false);

        $street = Street::factory()->create();

        $response = $this->actingAsTestUser()
            ->deleteJson('/api/street/delete/' . $street->id);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You dont Have Permission',
            ]);
    }
}
