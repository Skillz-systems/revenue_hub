<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\PropertyType;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PropertyTypeControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();

        // Create a user and set it as the current authenticated user
        $this->admin = User::factory()->create([
            'is_admin' => true,
        ]);

        $this->actingAs($this->admin, 'api');
    }

    /** @test */
    public function it_can_list_all_property_types()
    {
        PropertyType::factory()->count(3)->create();

        $response = $this->getJson('/api/property-type');

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
        $data = [
            'name' => $this->faker->word,
            'property_type_id' => $this->faker->randomNumber()
        ];

        $response = $this->postJson('/api/property-type/create', $data);

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
        $propertyType = PropertyType::factory()->create();

        $response = $this->getJson("/api/property-type/view/{$propertyType->id}");

        $response->assertStatus(200);
        $response->assertJson([
            'data' => ['id' => $propertyType->id, 'name' => $propertyType->name],
            'status' => 'success'
        ]);
    }

    /** @test */
    public function it_can_update_a_property_type()
    {
        $propertyType = PropertyType::factory()->create();

        $data = [
            'name' => $this->faker->word,
            'property_type_id' => $this->faker->randomNumber()
        ];

        $response = $this->putJson("/api/property-type/update/{$propertyType->id}", $data);

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
        $propertyType = PropertyType::factory()->create();

        $response = $this->deleteJson("/api/property-type/delete/{$propertyType->id}");

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'success',
            'message' => 'Property type deleted successfully'
        ]);
        $this->assertDatabaseMissing('property_types', ['id' => $propertyType->id]);
    }

    /** @test */
    public function non_admin_users_cannot_perform_crud_operations()
    {
        // Create a non-admin user and set it as the current authenticated user
        $user = User::factory()->create(['is_admin' => false]);
        $this->actingAs($user, 'api');

        $propertyType = PropertyType::factory()->create();

        $response = $this->getJson('/api/property-type');
        $response->assertStatus(403);

        $response = $this->postJson('/api/property-type/create', [
            'name' => 'Test Property',
            'property_type_id' => '1',
        ]);
        $response->assertStatus(403);

        $response = $this->getJson("/api/property-type/view/{$propertyType->id}");
        $response->assertStatus(403);

        $response = $this->putJson("/api/property-type/update/{$propertyType->id}", [
            'name' => 'Updated Property',
            'property_type_id' => '2',
        ]);
        $response->assertStatus(403);

        $response = $this->deleteJson("/api/property-type/delete/{$propertyType->id}");
        $response->assertStatus(403);
    }
}
