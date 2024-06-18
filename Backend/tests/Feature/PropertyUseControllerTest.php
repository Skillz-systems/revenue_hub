<?php

namespace Tests\Feature;

use Mockery;
use Tests\TestCase;
use App\Models\PropertyUse;
use App\Service\PropertyUseService;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PropertyUseControllerTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    use RefreshDatabase;

    protected $propertyUse;

    protected function setUp(): void
    {
        parent::setUp();

        // Mock the PropertyUseService
        $this->propertyUse = $this->createMock(PropertyUseService::class);
        $this->app->instance(PropertyUseService::class, $this->propertyUse);
    }

    /** @test */
    public function it_returns_property_use_if_user_is_admin_or_md()
    {
        // Assume the user is an admin or MD
        $this->propertyUse->method('checkIsAdminOrMd')->willReturn(true);

        // Assume the property use service returns some propertyUse
        $propertyUse = PropertyUse::factory()->count(3)->make();
        $this->propertyUse->method('getAllPropertyUse')->willReturn($propertyUse);

        $response = $this->actingAsTestUser()
            ->getJson('/api/property-use');

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
    public function it_returns_error_if_no_propertyUse_found()
    {
        // Assume the user is an admin or MD
        $this->propertyUse->method('checkIsAdminOrMd')->willReturn(true);

        // Assume the property use service returns no propertyUse
        $this->propertyUse->method('getAllPropertyUse')->willReturn(null);

        $response = $this->actingAsTestUser()
            ->getJson('/api/property-use');

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'No Property Use found',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md()
    {
        // Assume the user is not an admin or MD
        $this->propertyUse->method('checkIsAdminOrMd')->willReturn(false);

        $response = $this->actingAsTestUser()
            ->getJson('/api/property-use');

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You dont Have Permission',
            ]);
    }

    /** @test */
    public function it_creates_a_property_use_if_user_is_admin_or_md_and_data_is_valid()
    {
        // Assume the user is an admin or MD
        $this->propertyUse->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the creation process
        $createPropertyUse = PropertyUse::factory()->make();
        $this->propertyUse->method('create')->willReturn($createPropertyUse);

        $data = [
            'name' => 'Test Property Use',
        ];

        $response = $this->actingAsTestUser()
            ->postJson('/api/property-use/create', $data);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ])
            ->assertJsonStructure([
                'data' => ['id', 'name', 'created_at', 'updated_at']
            ]);
    }

    /** @test */
    public function it_returns_error_if_property_use_creation_validation_fails()
    {
        // Assume the user is an admin or MD
        $this->propertyUse->method('checkIsAdminOrMd')->willReturn(true);

        $data = [
            'name' => '',  // Invalid data
        ];

        $response = $this->actingAsTestUser()
            ->postJson('/api/property-use/create', $data);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'All fields are required',
            ])
            ->assertJsonStructure(['data']);
    }

    /** @test */
    public function it_returns_error_if_property_use_creation_fails()
    {
        // Assume the user is an admin or MD
        $this->propertyUse->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the creation process to fail
        $this->propertyUse->method('create')->willReturn(null);

        $data = [
            'name' => 'Test Property Use',
        ];

        $response = $this->actingAsTestUser()
            ->postJson('/api/property-use/create', $data);

        $response->assertStatus(500)
            ->assertJson([
                'status' => 'error',
                'message' => 'An error occured',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_property_use_creation()
    {
        // Assume the user is not an admin or MD
        $this->propertyUse->method('checkIsAdminOrMd')->willReturn(false);

        $data = [
            'name' => 'Test Property Use',
        ];

        $response = $this->actingAsTestUser()
            ->postJson('/api/property-use/create', $data);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You dont Have Permission',
            ]);
    }

    /** @test */
    public function it_returns_a_property_use_if_user_is_admin_or_md_and_property_use_exists()
    {
        // Assume the user is an admin or MD
        $this->propertyUse->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the property use
        $createPropertyUse = PropertyUse::factory()->make();
        $this->propertyUse->method('getPropertyUseById')->willReturn($createPropertyUse);

        $response = $this->actingAsTestUser()
            ->getJson('/api/property-use/view/1');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ])
            ->assertJsonStructure([
                'data' => ['id', 'name', 'created_at', 'updated_at']
            ]);
    }

    /** @test */
    public function it_returns_error_if_property_use_not_found()
    {
        // Assume the user is an admin or MD
        $this->propertyUse->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the property use not found
        $this->propertyUse->method('getPropertyUseById')->willReturn(null);

        $response = $this->actingAsTestUser()
            ->getJson('/api/property-use/view/999');

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'No Property Use Found',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_view_property_use()
    {
        // Assume the user is not an admin or MD
        $this->propertyUse->method('checkIsAdminOrMd')->willReturn(false);

        $response = $this->actingAsTestUser()
            ->getJson('/api/property-use/view/1');

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You dont Have Permission',
            ]);
    }

    /** @test */
    public function it_updates_a_property_use_if_user_is_admin_or_md_and_data_is_valid()
    {
        // Assume the user is an admin or MD
        $this->propertyUse->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the update process
        $createPropertyUse = PropertyUse::factory()->create([
            'name' => "New Nme",
        ]);
        $this->propertyUse->method('updatePropertyUse')->willReturn(true);

        $data = [
            'name' => 'Updated Property Use Name',
        ];

        $response = $this->actingAsTestUser()
            ->putJson('/api/property-use/update/' . $createPropertyUse->id, $data);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Property Use Updated successfully',
            ]);
    }

    /** @test */
    public function it_returns_error_if_validation_fails()
    {
        // Assume the user is an admin or MD
        $this->propertyUse->method('checkIsAdminOrMd')->willReturn(true);

        $data = [
            'name' => '',  // Invalid data
        ];

        $response = $this->actingAsTestUser()
            ->putJson('/api/property-use/update/1', $data);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'All fields are required',
            ])
            ->assertJsonStructure(['data']);
    }

    /** @test */
    public function it_returns_error_if_property_use_update_fails()
    {
        // Assume the user is an admin or MD
        $this->propertyUse->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the update process to fail
        $this->propertyUse->method('updatePropertyUse')->willReturn(false);

        $createPropertyUse = PropertyUse::factory()->create([
            'name' => "New Nme",
        ]);

        $data = [
            'name' => 'Updated Property Use Name',
        ];

        $response = $this->actingAsTestUser()
            ->putJson('/api/property-use/update/' . $createPropertyUse->id, $data);

        $response->assertStatus(500)
            ->assertJson([
                'status' => 'error',
                'message' => 'An error occured',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_update_property_use()
    {
        // Assume the user is not an admin or MD
        $this->propertyUse->method('checkIsAdminOrMd')->willReturn(false);

        $createPropertyUse = PropertyUse::factory()->create([
            'name' => "New Nme",
        ]);
        $data = [
            'name' => 'Updated Property Use Name',
        ];

        $response = $this->actingAsTestUser()
            ->putJson('/api/property-use/update/' . $createPropertyUse->id, $data);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You dont Have Permission',
            ]);
    }

    /** @test */
    public function it_deletes_a_property_use_if_user_is_admin_or_md()
    {
        // Assume the user is an admin or MD
        $this->propertyUse->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the delete process
        $this->propertyUse->method('deletePropertyUse')->willReturn(true);

        $createPropertyUse = PropertyUse::factory()->create([
            'name' => "New Nme",
        ]);

        $response = $this->actingAsTestUser()
            ->deleteJson('/api/property-use/delete/' . $createPropertyUse->id);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Property Use deleted successfully',
            ]);
    }

    /** @test */
    public function it_returns_error_if_property_use_deletion_fails()
    {
        // Assume the user is an admin or MD
        $this->propertyUse->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the delete process to fail
        $this->propertyUse->method('deletePropertyUse')->willReturn(false);

        $createPropertyUse = PropertyUse::factory()->create([
            'name' => "New Nme",
        ]);

        $response = $this->actingAsTestUser()
            ->deleteJson('/api/property-use/delete/' . $createPropertyUse->id);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'An error occured',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_delete_property_use()
    {
        // Assume the user is not an admin or MD
        $this->propertyUse->method('checkIsAdminOrMd')->willReturn(false);

        $createPropertyUse = PropertyUse::factory()->create([
            'name' => "New Nme",
        ]);

        $response = $this->actingAsTestUser()
            ->deleteJson('/api/property-use/delete/' . $createPropertyUse->id);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You dont Have Permission',
            ]);
    }
}
