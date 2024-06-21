<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Role;
use App\Models\User;
use App\Models\PropertyType;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PropertyTypeControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;


    protected $admin;

    /*protected function setUp(): void
    {
        parent::setUp();

        // Create a user and set it as the current authenticated user
        $this->admin = User::factory()->create([
            'role_id' => 1,
        ]);

        $this->actingAs($this->admin, 'api');
    }*/

    /** @test */
    public function it_can_list_all_property_types()
    {
        $role = Role::factory()->create();
        User::factory()->count(5)->create(["role_id" => $role->id]); // Assuming you have a User factory

        PropertyType::factory()->count(3)->create();

        $response = $this->actingAsTestUser()->getJson('/api/property-type');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'name', 'created_at', 'updated_at']
            ],
            'status'
        ]);
    }

    /** @test */
    public function it_can_create_a_property_type()
    {
        $role = Role::factory()->create();

        User::factory()->count(5)->create(["role_id" => $role->id]); // Assuming you have a User factory

        $data = [
            'name' => $this->faker->word,
        ];

        $response = $this->actingAsTestUser()->postJson('/api/property-type/create', $data);

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'success',
            'message' => 'Property type created successfully'
        ]);
        $this->assertDatabaseHas('property_types', $data);
    }

    /** @test */
    public function it_can_show_a_specific_property_type()
    {
        $role = Role::factory()->create();

        User::factory()->count(5)->create(["role_id" => $role->id]); // Assuming you have a User factory

        $propertyType = PropertyType::factory()->create();

        $response = $this->actingAsTestUser()->getJson("/api/property-type/view/{$propertyType->id}");

        $response->assertStatus(200);
        $response->assertJson([
            'data' => ['id' => $propertyType->id, 'name' => $propertyType->name],
            'status' => 'success'
        ]);
    }

    /** @test */
    public function it_can_update_a_property_type()
    {

        $role = Role::factory()->create();

        User::factory()->count(5)->create(["role_id" => $role->id]); // Assuming you have a User factor

        $propertyType = PropertyType::factory()->create();

        $data = [
            'name' => $this->faker->word,
        ];

        $response = $this->actingAsTestUser()->putJson("/api/property-type/update/{$propertyType->id}", $data);

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'success',
            'message' => 'Property type updated successfully'
        ]);
        $this->assertDatabaseHas('property_types', array_merge(['id' => $propertyType->id], $data));
    }

    /** @test */
    public function it_can_delete_a_property_type()
    {
        $role = Role::factory()->create();

        User::factory()->count(5)->create(["role_id" => $role->id]); // Assuming you have a User factory

        $propertyType = PropertyType::factory()->create();

        $response = $this->actingAsTestUser()->deleteJson("/api/property-type/delete/{$propertyType->id}");

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'success',
            'message' => 'Property type deleted successfully'
        ]);
        $this->assertDatabaseMissing('property_types', ['id' => $propertyType->id]);
    }
}
