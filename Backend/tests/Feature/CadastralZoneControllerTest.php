<?php

namespace Tests\Feature;

use Mockery;
use Tests\TestCase;
use App\Models\Street;
use App\Models\CadastralZone;
use App\Service\CadastralZoneService;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CadastralZoneControllerTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    use RefreshDatabase;

    protected $cadastralZone;

    protected function setUp(): void
    {
        parent::setUp();

        // Mock the CadastralZoneService
        $this->cadastralZone = $this->createMock(CadastralZoneService::class);
        $this->app->instance(CadastralZoneService::class, $this->cadastralZone);
    }

    /** @test */
    public function it_returns_cadastral_zone_if_user_is_admin_or_md()
    {
        // Assume the user is an admin or MD
        $this->cadastralZone->method('checkIsAdminOrMd')->willReturn(true);

        // Assume the street service returns some cadastralZone
        $cadastralZone = CadastralZone::factory()->count(3)->make();
        $this->cadastralZone->method('getAllCadastralZone')->willReturn($cadastralZone);

        $response = $this->actingAsTestUser()
            ->getJson('/api/cadastral-zone');

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
    public function it_returns_error_if_no_cadastralZone_found()
    {
        // Assume the user is an admin or MD
        $this->cadastralZone->method('checkIsAdminOrMd')->willReturn(true);

        // Assume the street service returns no cadastralZone
        $this->cadastralZone->method('getAllCadastralZone')->willReturn(null);

        $response = $this->actingAsTestUser()
            ->getJson('/api/cadastral-zone');

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'No Cadastral Zone found',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md()
    {
        // Assume the user is not an admin or MD
        $this->cadastralZone->method('checkIsAdminOrMd')->willReturn(false);

        $response = $this->actingAsTestUser()
            ->getJson('/api/cadastral-zone');

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You dont Have Permission',
            ]);
    }

    /** @test */
    public function it_creates_a_cadastral_zone_if_user_is_admin_or_md_and_data_is_valid()
    {
        // Assume the user is an admin or MD
        $this->cadastralZone->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the creation process
        $createCadastralZone = CadastralZone::factory()->make();
        $this->cadastralZone->method('create')->willReturn($createCadastralZone);

        $data = [
            'name' => 'Test Street',
            'rating_district_id' => 'Test Zone',
        ];

        $response = $this->actingAsTestUser()
            ->postJson('/api/cadastral-zone/create', $data);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ])
            ->assertJsonStructure([
                'data' => ['id', 'name', 'rating_district_id', 'created_at', 'updated_at']
            ]);
    }

    /** @test */
    public function it_returns_error_if_cadastral_zone_creation_validation_fails()
    {
        // Assume the user is an admin or MD
        $this->cadastralZone->method('checkIsAdminOrMd')->willReturn(true);

        $data = [
            'name' => '',  // Invalid data
            'rating_district_id' => '',
        ];

        $response = $this->actingAsTestUser()
            ->postJson('/api/cadastral-zone/create', $data);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'All fields are required',
            ])
            ->assertJsonStructure(['data']);
    }

    /** @test */
    public function it_returns_error_if_cadastral_zone_creation_fails()
    {
        // Assume the user is an admin or MD
        $this->cadastralZone->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the creation process to fail
        $this->cadastralZone->method('create')->willReturn(null);

        $data = [
            'name' => 'Test Street',
            'rating_district_id' => 'Test Zone',
        ];

        $response = $this->actingAsTestUser()
            ->postJson('/api/cadastral-zone/create', $data);

        $response->assertStatus(500)
            ->assertJson([
                'status' => 'error',
                'message' => 'An error occured',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_cadastral_zone_creation()
    {
        // Assume the user is not an admin or MD
        $this->cadastralZone->method('checkIsAdminOrMd')->willReturn(false);

        $data = [
            'name' => 'Test Street',
            'rating_district_id' => 'Test Zone',
        ];

        $response = $this->actingAsTestUser()
            ->postJson('/api/cadastral-zone/create', $data);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You dont Have Permission',
            ]);
    }

    /** @test */
    public function it_returns_a_cadastral_zone_if_user_is_admin_or_md_and_cadastral_zone_exists()
    {
        // Assume the user is an admin or MD
        $this->cadastralZone->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the street
        $createCadastralZone = CadastralZone::factory()->make();
        $this->cadastralZone->method('getCadastralZoneById')->willReturn($createCadastralZone);

        $response = $this->actingAsTestUser()
            ->getJson('/api/cadastral-zone/view/1');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ])
            ->assertJsonStructure([
                'data' => ['id', 'name', 'rating_district_id', 'created_at', 'updated_at']
            ]);
    }

    /** @test */
    public function it_returns_error_if_cadastral_zone_not_found()
    {
        // Assume the user is an admin or MD
        $this->cadastralZone->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the street not found
        $this->cadastralZone->method('getCadastralZoneById')->willReturn(null);

        $response = $this->actingAsTestUser()
            ->getJson('/api/cadastral-zone/view/999');

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'No Cadastral Zone Found',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_view_street()
    {
        // Assume the user is not an admin or MD
        $this->cadastralZone->method('checkIsAdminOrMd')->willReturn(false);

        $response = $this->actingAsTestUser()
            ->getJson('/api/cadastral-zone/view/1');

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You dont Have Permission',
            ]);
    }

    /** @test */
    public function it_updates_a_cadastral_zone_if_user_is_admin_or_md_and_data_is_valid()
    {
        // Assume the user is an admin or MD
        $this->cadastralZone->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the update process
        $createCadastralZone = CadastralZone::factory()->create([
            'name' => "New Nme",
            'rating_district_id' => '2',
        ]);
        $this->cadastralZone->method('updateCadastralZone')->willReturn(true);

        $data = [
            'name' => 'Updated Cadastral Zone Name',
            'rating_district_id' => 'Updated Rating Id',
        ];

        $response = $this->actingAsTestUser()
            ->putJson('/api/cadastral-zone/update/' . $createCadastralZone->id, $data);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Cadastral Zone Updated successfully',
            ]);
    }

    /** @test */
    public function it_returns_error_if_validation_fails()
    {
        // Assume the user is an admin or MD
        $this->cadastralZone->method('checkIsAdminOrMd')->willReturn(true);

        $data = [
            'name' => '',  // Invalid data
            'rating_district_id' => '',
        ];

        $response = $this->actingAsTestUser()
            ->putJson('/api/cadastral-zone/update/1', $data);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'All fields are required',
            ])
            ->assertJsonStructure(['data']);
    }

    /** @test */
    public function it_returns_error_if_cadastral_zone_update_fails()
    {
        // Assume the user is an admin or MD
        $this->cadastralZone->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the update process to fail
        $this->cadastralZone->method('updateCadastralZone')->willReturn(false);

        $createCadastralZone = CadastralZone::factory()->create([
            'name' => "New Nme",
            'rating_district_id' => '2',
        ]);

        $data = [
            'name' => 'Updated Cadastral Zone Name',
            'rating_district_id' => 'Updated Rating Id',
        ];

        $response = $this->actingAsTestUser()
            ->putJson('/api/cadastral-zone/update/' . $createCadastralZone->id, $data);

        $response->assertStatus(500)
            ->assertJson([
                'status' => 'error',
                'message' => 'An error occured',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_update_cadastral_zone()
    {
        // Assume the user is not an admin or MD
        $this->cadastralZone->method('checkIsAdminOrMd')->willReturn(false);

        $createCadastralZone = CadastralZone::factory()->create([
            'name' => "New Nme",
            'rating_district_id' => '2',
        ]);
        $data = [
            'name' => 'Updated Cadastral Zone Name',
            'rating_district_id' => 'Updated Rating Id',
        ];

        $response = $this->actingAsTestUser()
            ->putJson('/api/cadastral-zone/update/' . $createCadastralZone->id, $data);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You dont Have Permission',
            ]);
    }

    /** @test */
    public function it_deletes_a_cadastral_zone_if_user_is_admin_or_md()
    {
        // Assume the user is an admin or MD
        $this->cadastralZone->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the delete process
        $this->cadastralZone->method('deleteCadastralZone')->willReturn(true);

        $createCadastralZone = CadastralZone::factory()->create([
            'name' => "New Nme",
            'rating_district_id' => '2',
        ]);

        $response = $this->actingAsTestUser()
            ->deleteJson('/api/cadastral-zone/delete/' . $createCadastralZone->id);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Cadastral Zone deleted successfully',
            ]);
    }

    /** @test */
    public function it_returns_error_if_cadastral_zone_deletion_fails()
    {
        // Assume the user is an admin or MD
        $this->cadastralZone->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the delete process to fail
        $this->cadastralZone->method('deleteCadastralZone')->willReturn(false);

        $createCadastralZone = CadastralZone::factory()->create([
            'name' => "New Nme",
            'rating_district_id' => '2',
        ]);

        $response = $this->actingAsTestUser()
            ->deleteJson('/api/cadastral-zone/delete/' . $createCadastralZone->id);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'An error occured',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_delete_cadastral_zone()
    {
        // Assume the user is not an admin or MD
        $this->cadastralZone->method('checkIsAdminOrMd')->willReturn(false);

        $createCadastralZone = CadastralZone::factory()->create([
            'name' => "New Nme",
            'rating_district_id' => '2',
        ]);

        $response = $this->actingAsTestUser()
            ->deleteJson('/api/cadastral-zone/delete/' . $createCadastralZone->id);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You dont Have Permission',
            ]);
    }
}
