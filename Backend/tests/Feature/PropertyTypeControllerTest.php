<?php

namespace Tests\Feature;

use Mockery;
use Tests\TestCase;
use App\Models\Role;
use App\Models\User;
use App\Models\PropertyType;
use App\Mail\RegisterMail;
use App\Service\StaffService;
use App\Service\PropertyTypeService;
use App\Mail\ForgotPasswordMail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PropertyTypeControllerTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    use RefreshDatabase;

    protected $propertyTypeService;

    protected function setUp(): void
    {
        parent::setUp();

        // Mock the propertyTypeService
        $this->propertyTypeService = $this->createMock(PropertyTypeService::class);
        $this->app->instance(PropertyTypeService::class, $this->propertyTypeService);
    }

    /** @test */
    public function it_returns_propertyTypes_if_user_is_admin_or_md()
    {
        // Assume the user is an admin or MD
        $this->propertyTypeService->method('checkIsAdminOrMd')->willReturn(true);

        // Assume the propertyType service returns some propertyTypes
        $propertyTypes = PropertyType::factory()->count(3)->make();
        $this->propertyTypeService->method('getAllPropertyType')->willReturn($propertyTypes);

        $response = $this->actingAsTestUser()
            ->getJson('/api/property-type');

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
    public function it_returns_error_if_no_propertyTypes_found()
    {
        // Assume the user is an admin or MD
        $this->propertyTypeService->method('checkIsAdminOrMd')->willReturn(true);

        // Assume the propertyType service returns no propertyTypes
        $this->propertyTypeService->method('getAllPropertyType')->willReturn(null);

        $response = $this->actingAsTestUser()
            ->getJson('/api/property-type');

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'No property type found',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md()
    {
        // Assume the user is not an admin or MD
        $this->propertyTypeService->method('checkIsAdminOrMd')->willReturn(false);

        $response = $this->actingAsTestUser()
            ->getJson('/api/property-type');

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You don\'t have permission',
            ]);
    }

    /** @test */
    public function it_creates_a_propertyType_if_user_is_admin_or_md_and_data_is_valid()
    {
        // Assume the user is an admin or MD
        $this->propertyTypeService->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the creation process
        $propertyType = PropertyType::factory()->make();
        $this->propertyTypeService->method('create')->willReturn($propertyType);

        $data = [
            'name' => 'Test PropertyType',
        ];

        $response = $this->actingAsTestUser()
            ->postJson('/api/property-type/create', $data);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ])
            ->assertJsonStructure([
                'data' => ['id', 'name', 'created_at', 'updated_at']
            ]);
    }

    /** @test */
    public function it_returns_error_if_propertyType_creation_validation_fails()
    {
        // Assume the user is an admin or MD
        $this->propertyTypeService->method('checkIsAdminOrMd')->willReturn(true);

        $data = [
            'name' => '',  // Invalid data
        ];

        $response = $this->actingAsTestUser()
            ->postJson('/api/property-type/create', $data);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'All fields are required',
            ])
            ->assertJsonStructure(['data']);
    }

    /** @test */
    public function it_returns_error_if_propertyType_creation_fails()
    {
        // Assume the user is an admin or MD
        $this->propertyTypeService->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the creation process to fail
        $this->propertyTypeService->method('create')->willReturn(null);

        $data = [
            'name' => 'Test PropertyType',
        ];

        $response = $this->actingAsTestUser()
            ->postJson('/api/property-type/create', $data);

        $response->assertStatus(500)
            ->assertJson([
                'status' => 'error',
                'message' => 'An error occurred',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_propertyType_creation()
    {
        // Assume the user is not an admin or MD
        $this->propertyTypeService->method('checkIsAdminOrMd')->willReturn(false);

        $data = [
            'name' => 'Test PropertyType',
        ];

        $response = $this->actingAsTestUser()
            ->postJson('/api/property-type/create', $data);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You don\'t have permission',
            ]);
    }

    /** @test */
    public function it_returns_a_propertyType_if_user_is_admin_or_md_and_propertyType_exists()
    {
        // Assume the user is an admin or MD
        $this->propertyTypeService->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the propertyType
        $propertyType = PropertyType::factory()->make();
        $this->propertyTypeService->method('getPropertyTypeById')->willReturn($propertyType);

        $response = $this->actingAsTestUser()
            ->getJson('/api/property-type/view/1');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ])
            ->assertJsonStructure([
                'data' => ['id', 'name', 'created_at', 'updated_at']
            ]);
    }

    /** @test */
    public function it_returns_error_if_propertyType_not_found()
    {
        // Assume the user is an admin or MD
        $this->propertyTypeService->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the propertyType not found
        $this->propertyTypeService->method('getPropertyTypeById')->willReturn(null);

        $response = $this->actingAsTestUser()
            ->getJson('/api/property-type/view/999');

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'No property type found',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_view_propertyType()
    {
        // Assume the user is not an admin or MD
        $this->propertyTypeService->method('checkIsAdminOrMd')->willReturn(false);

        $response = $this->actingAsTestUser()
            ->getJson('/api/property-type/view/1');

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You don\'t have permission',
            ]);
    }

    /** @test */
    public function it_updates_a_propertyType_if_user_is_admin_or_md_and_data_is_valid()
    {
        // Assume the user is an admin or MD
        $this->propertyTypeService->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the update process
        $propertyType = PropertyType::factory()->create();
        $this->propertyTypeService->method('updatePropertyType')->willReturn(true);

        $data = [
            'name' => 'Updated PropertyType Name',
        ];

        $response = $this->actingAsTestUser()
            ->putJson('/api/property-type/update/' . $propertyType->id, $data);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Property type updated successfully',
            ]);
    }

    /** @test */
    public function it_returns_error_if_validation_fails()
    {
        // Assume the user is an admin or MD
        $this->propertyTypeService->method('checkIsAdminOrMd')->willReturn(true);

        $data = [
            'name' => '',  // Invalid data
        ];

        $response = $this->actingAsTestUser()
            ->putJson('/api/property-type/update/1', $data);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'All fields are required',
            ])
            ->assertJsonStructure(['data']);
    }

    /** @test */
    public function it_returns_error_if_propertyType_update_fails()
    {
        // Assume the user is an admin or MD
        $this->propertyTypeService->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the update process to fail
        $this->propertyTypeService->method('updatePropertyType')->willReturn(false);

        $propertyType = PropertyType::factory()->create();
        $data = [
            'name' => 'Updated PropertyType Name',
        ];

        $response = $this->actingAsTestUser()
            ->putJson('/api/property-type/update/' . $propertyType->id, $data);

        $response->assertStatus(500)
            ->assertJson([
                'status' => 'error',
                'message' => 'An error occurred',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_update_propertyType()
    {
        // Assume the user is not an admin or MD
        $this->propertyTypeService->method('checkIsAdminOrMd')->willReturn(false);

        $propertyType = PropertyType::factory()->create();
        $data = [
            'name' => 'Updated PropertyType Name',
        ];

        $response = $this->actingAsTestUser()
            ->putJson('/api/property-type/update/' . $propertyType->id, $data);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You don\'t have permission',
            ]);
    }

    /** @test */
    public function it_deletes_a_propertyType_if_user_is_admin_or_md()
    {
        // Assume the user is an admin or MD
        $this->propertyTypeService->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the delete process
        $this->propertyTypeService->method('deletePropertyType')->willReturn(true);

        $propertyType = PropertyType::factory()->create();

        $response = $this->actingAsTestUser()
            ->deleteJson('/api/property-type/delete/' . $propertyType->id);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Property type deleted successfully',
            ]);
    }

    /** @test */
    public function it_returns_error_if_propertyType_deletion_fails()
    {
        // Assume the user is an admin or MD
        $this->propertyTypeService->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the delete process to fail
        $this->propertyTypeService->method('deletePropertyType')->willReturn(false);

        $propertyType = PropertyType::factory()->create();

        $response = $this->actingAsTestUser()
            ->deleteJson('/api/property-type/delete/' . $propertyType->id);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'An error occurred',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_delete_propertyType()
    {
        // Assume the user is not an admin or MD
        $this->propertyTypeService->method('checkIsAdminOrMd')->willReturn(false);

        $propertyType = PropertyType::factory()->create();

        $response = $this->actingAsTestUser()
            ->deleteJson('/api/property-type/delete/' . $propertyType->id);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You don\'t have permission',
            ]);
    }
}
