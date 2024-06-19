<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\PropertyUse;
use App\Service\PropertyUseService;
use Faker\Factory as Faker;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PropertyUseServiceTest extends TestCase
{
    use RefreshDatabase;

    protected $service;
    private  $faker;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new PropertyUseService();
        $this->faker = Faker::create();
    }

    public function test_to_get__all_property_use()
    {
        // Create some dummy data
        PropertyUse::factory()->count(3)->create([
            'name' => "New Name",
        ]);

        // Call the method
        $propertyUse = $this->service->getAllPropertyUse();

        // Assert that the method returns a collection of property use
        $this->assertInstanceOf(Collection::class, $propertyUse);

        // Assert that the number of returned property use matches the number of created dummy data
        $this->assertEquals(3, $propertyUse->count());
    }

    public function test_to_see_if_property_use_can_be_created()
    {
        // Data for creating a property use
        $data = [
            'name' => 'Test Property Use',
            // Add other required fields here
        ];

        // Call the create method
        $createdPropertyUse = $this->service->create($data);

        // Assert that a property use was created
        $this->assertNotNull($createdPropertyUse);

        // Assert that the created property use matches the data provided
        $this->assertEquals($data['name'], $createdPropertyUse->name);
        // Add assertions for other fields if needed
    }

    public function test_to_get_property_use_from_property_use_name()
    {
        // Create a dummy property use
        $propertyUse = PropertyUse::factory()->create([
            'name' => "New Name",
        ]);

        // Call the getPropertyUseFromPropertyUseName method
        $retrievedPropertyUse = ($this->service)->getPropertyUseFromPropertyUseName('New Name');

        // Assert that the retrieved property use is not null
        $this->assertNotNull($retrievedPropertyUse);

        // Assert that the retrieved property use matches the created property use
        $this->assertEquals($propertyUse->name, $retrievedPropertyUse->name);
        // Add assertions for other fields if needed
    }

    public function test_to_get_property_use_by_id()
    {
        // Create a dummy property use
        $propertyUse = PropertyUse::factory()->create([
            'name' => 'Test Property Use',
            // Add other required fields here
        ]);

        // Call the getPropertyUseById method
        $retrievedPropertyUse = $this->service->getPropertyUseById($propertyUse->id);

        // Assert that the retrieved property use is not null
        $this->assertNotNull($retrievedPropertyUse);

        // Assert that the retrieved property use matches the created property use
        $this->assertEquals($propertyUse->id, $retrievedPropertyUse->id);
        $this->assertEquals($propertyUse->name, $retrievedPropertyUse->name);
        $this->assertEquals($propertyUse->property_use_id, $retrievedPropertyUse->property_use_id);
        // Add assertions for other fields if needed
    }

    public function test_to_update_property_use()
    {
        $data = [
            "name" => $this->faker->streetName(),
        ];
        $propertyUse = PropertyUse::factory()->create([
            'name' => "New Name",
        ]);
        $updatePropertyUse = $this->service->updatePropertyUse($data, $propertyUse->id);
        $this->assertEquals($updatePropertyUse, true);
    }

    public function test_delete_existing_property_use()
    {
        // Create a dummy property use
        $propertyUse = PropertyUse::factory()->create([
            'name' => 'Test Property Use',
        ]);

        // Call the deletePropertyUse method
        $result = $this->service->deletePropertyUse($propertyUse->id);

        // Assert that the delete operation was successful
        $this->assertTrue($result);

        // Assert that the property use no longer exists in the database
        $this->assertDatabaseMissing('property_uses', ['id' => $propertyUse->id]);
    }
}
