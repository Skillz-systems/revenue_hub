<?php

namespace Tests\Feature;

use Mockery;
use Tests\TestCase;
use App\Models\Street;
use App\Models\OfficeZone;
use App\Service\OfficeZoneService;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OfficeZoneControllerTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    use RefreshDatabase;

    protected $officeZone;

    protected function setUp(): void
    {
        parent::setUp();

        // Mock the OfficeZoneService
        $this->officeZone = $this->createMock(OfficeZoneService::class);
        $this->app->instance(OfficeZoneService::class, $this->officeZone);
    }

    /** @test */
    public function it_returns_office_zone_if_user_is_admin_or_md()
    {
        // Assume the user is an admin or MD
        $this->officeZone->method('checkIsAdminOrMd')->willReturn(true);

        // Assume the street service returns some officeZone
        $officeZone = OfficeZone::factory()->count(3)->make();
        $this->officeZone->method('getAllOfficeZone')->willReturn($officeZone);

        $response = $this->actingAsTestUser()
            ->getJson('/api/office-zone');

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
    public function it_returns_error_if_no_officeZone_found()
    {
        // Assume the user is an admin or MD
        $this->officeZone->method('checkIsAdminOrMd')->willReturn(true);

        // Assume the street service returns no officeZone
        $this->officeZone->method('getAllOfficeZone')->willReturn(null);

        $response = $this->actingAsTestUser()
            ->getJson('/api/office-zone');

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'No Office Zone found',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md()
    {
        // Assume the user is not an admin or MD
        $this->officeZone->method('checkIsAdminOrMd')->willReturn(false);

        $response = $this->actingAsTestUser()
            ->getJson('/api/office-zone');

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You dont Have Permission',
            ]);
    }

    /** @test */
    public function it_creates_a_office_zone_if_user_is_admin_or_md_and_data_is_valid()
    {
        // Assume the user is an admin or MD
        $this->officeZone->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the creation process
        $createOfficeZone = OfficeZone::factory()->make();
        $this->officeZone->method('create')->willReturn($createOfficeZone);

        $data = [
            'name' => 'Test Name',
            'address' => 'Test Address',
        ];

        $response = $this->actingAsTestUser()
            ->postJson('/api/office-zone/create', $data);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ])
            ->assertJsonStructure([
                'data' => ['id', 'name', 'address', 'created_at', 'updated_at']
            ]);
    }

    /** @test */
    public function it_returns_error_if_office_zone_creation_validation_fails()
    {
        // Assume the user is an admin or MD
        $this->officeZone->method('checkIsAdminOrMd')->willReturn(true);

        $data = [
            'name' => '',  // Invalid data
            'address' => '',
        ];

        $response = $this->actingAsTestUser()
            ->postJson('/api/office-zone/create', $data);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'All fields are required',
            ])
            ->assertJsonStructure(['data']);
    }

    /** @test */
    public function it_returns_error_if_office_zone_creation_fails()
    {
        // Assume the user is an admin or MD
        $this->officeZone->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the creation process to fail
        $this->officeZone->method('create')->willReturn(null);

        $data = [
            'name' => 'Test Name',
            'address' => 'Test Address',
        ];

        $response = $this->actingAsTestUser()
            ->postJson('/api/office-zone/create', $data);

        $response->assertStatus(500)
            ->assertJson([
                'status' => 'error',
                'message' => 'An error occured',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_office_zone_creation()
    {
        // Assume the user is not an admin or MD
        $this->officeZone->method('checkIsAdminOrMd')->willReturn(false);

        $data = [
            'name' => 'Test Name',
            'address' => 'Test Address',
        ];

        $response = $this->actingAsTestUser()
            ->postJson('/api/office-zone/create', $data);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You dont Have Permission',
            ]);
    }

    /** @test */
    public function it_returns_a_office_zone_if_user_is_admin_or_md_and_office_zone_exists()
    {
        // Assume the user is an admin or MD
        $this->officeZone->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the street
        $createOfficeZone = OfficeZone::factory()->make();
        $this->officeZone->method('getOfficeZoneById')->willReturn($createOfficeZone);

        $response = $this->actingAsTestUser()
            ->getJson('/api/office-zone/view/1');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ])
            ->assertJsonStructure([
                'data' => ['id', 'name', 'address', 'created_at', 'updated_at']
            ]);
    }

    /** @test */
    public function it_returns_error_if_office_zone_not_found()
    {
        // Assume the user is an admin or MD
        $this->officeZone->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the street not found
        $this->officeZone->method('getOfficeZoneById')->willReturn(null);

        $response = $this->actingAsTestUser()
            ->getJson('/api/office-zone/view/999');

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'No Office Zone Found',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_view_street()
    {
        // Assume the user is not an admin or MD
        $this->officeZone->method('checkIsAdminOrMd')->willReturn(false);

        $response = $this->actingAsTestUser()
            ->getJson('/api/office-zone/view/1');

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You dont Have Permission',
            ]);
    }

    /** @test */
    public function it_updates_a_office_zone_if_user_is_admin_or_md_and_data_is_valid()
    {
        // Assume the user is an admin or MD
        $this->officeZone->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the update process
        $createOfficeZone = OfficeZone::factory()->create([
            'name' => "New Nme",
            'address' => '2',
        ]);
        $this->officeZone->method('updateOfficeZone')->willReturn(true);

        $data = [
            'name' => 'Updated Office Zone Name',
            'address' => 'Updated Rating Id',
        ];

        $response = $this->actingAsTestUser()
            ->putJson('/api/office-zone/update/' . $createOfficeZone->id, $data);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Office Zone Updated successfully',
            ]);
    }

    /** @test */
    public function it_returns_error_if_validation_fails()
    {
        // Assume the user is an admin or MD
        $this->officeZone->method('checkIsAdminOrMd')->willReturn(true);

        $data = [
            'name' => '',  // Invalid data
            'address' => '',
        ];

        $response = $this->actingAsTestUser()
            ->putJson('/api/office-zone/update/1', $data);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'All fields are required',
            ])
            ->assertJsonStructure(['data']);
    }

    /** @test */
    public function it_returns_error_if_office_zone_update_fails()
    {
        // Assume the user is an admin or MD
        $this->officeZone->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the update process to fail
        $this->officeZone->method('updateOfficeZone')->willReturn(false);

        $createOfficeZone = OfficeZone::factory()->create([
            'name' => "New Nme",
            'address' => '2',
        ]);

        $data = [
            'name' => 'Updated Office Zone Name',
            'address' => 'Updated Rating Id',
        ];

        $response = $this->actingAsTestUser()
            ->putJson('/api/office-zone/update/' . $createOfficeZone->id, $data);

        $response->assertStatus(500)
            ->assertJson([
                'status' => 'error',
                'message' => 'An error occured',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_update_office_zone()
    {
        // Assume the user is not an admin or MD
        $this->officeZone->method('checkIsAdminOrMd')->willReturn(false);

        $createOfficeZone = OfficeZone::factory()->create([
            'name' => "New Nme",
            'address' => '2',
        ]);
        $data = [
            'name' => 'Updated Office Zone Name',
            'address' => 'Updated Rating Id',
        ];

        $response = $this->actingAsTestUser()
            ->putJson('/api/office-zone/update/' . $createOfficeZone->id, $data);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You dont Have Permission',
            ]);
    }

    /** @test */
    public function it_deletes_a_office_zone_if_user_is_admin_or_md()
    {
        // Assume the user is an admin or MD
        $this->officeZone->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the delete process
        $this->officeZone->method('deleteOfficeZone')->willReturn(true);

        $createOfficeZone = OfficeZone::factory()->create([
            'name' => "New Nme",
            'address' => '2',
        ]);

        $response = $this->actingAsTestUser()
            ->deleteJson('/api/office-zone/delete/' . $createOfficeZone->id);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Office Zone deleted successfully',
            ]);
    }

    /** @test */
    public function it_returns_error_if_office_zone_deletion_fails()
    {
        // Assume the user is an admin or MD
        $this->officeZone->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the delete process to fail
        $this->officeZone->method('deleteOfficeZone')->willReturn(false);

        $createOfficeZone = OfficeZone::factory()->create([
            'name' => "New Nme",
            'address' => '2',
        ]);

        $response = $this->actingAsTestUser()
            ->deleteJson('/api/office-zone/delete/' . $createOfficeZone->id);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'An error occured',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_delete_office_zone()
    {
        // Assume the user is not an admin or MD
        $this->officeZone->method('checkIsAdminOrMd')->willReturn(false);

        $createOfficeZone = OfficeZone::factory()->create([
            'name' => "New Nme",
            'address' => '2',
        ]);

        $response = $this->actingAsTestUser()
            ->deleteJson('/api/office-zone/delete/' . $createOfficeZone->id);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You dont Have Permission',
            ]);
    }
}
