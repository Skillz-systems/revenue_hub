<?php

namespace Tests\Unit\Service;

use Tests\TestCase;
use App\Models\User;
use App\Models\PropertyType;
use Faker\Factory as Faker;
use App\Service\PropertyTypeService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Testing\Fakes\Fake;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PropertyTypeServiceTest extends TestCase
{
    use RefreshDatabase;

    protected $service;
    protected $faker;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new PropertyTypeService();
        $this->faker = Faker::create();
    }

    public function testGetAllPropertyType()
    {
        // Create some dummy data
        PropertyType::factory()->count(2)->create();

        // Call the method
        $propertyTypes = $this->service->getAllPropertyType();

        // Assert that the method returns a collection of property types
        $this->assertInstanceOf(Collection::class, $propertyTypes);

        // Assert that the number of returned property types matches the number of created dummy data
        $this->assertEquals(2, $propertyTypes->count());
    }

    public function testCreate()
    {
        // Data for creating a property type
        $data = [
            'name' => $this->faker->word,
            // Add other required fields here
        ];

        // Call the create method
        $createdPropertyType = $this->service->create($data);

        // Assert that a property type was created
        $this->assertNotNull($createdPropertyType);

        // Assert that the created property type matches the data provided
        $this->assertEquals($data['name'], $createdPropertyType->name);
        // Add assertions for other fields if needed
    }

    public function testGetPropertyTypeFromPropertyTypeName()
    {
        // Create a dummy property type
        $propertyType = PropertyType::factory()->create([
            'name' => 'Test PropertyType',
            // Add other required fields here
        ]);

        // Call the getPropertyTypeFromPropertyTypeName method
        $retrievedPropertyType = (new PropertyTypeService())->getPropertyTypeFromPropertyTypeName('Test PropertyType');
        
        // Assert that the retrieved property type is not null
        $this->assertNotNull($retrievedPropertyType);

        // Assert that the retrieved property type matches the created property type
        $this->assertEquals($propertyType->name, $retrievedPropertyType->name);
        // Add assertions for other fields if needed
    }

    public function testGetPropertyTypeById()
    {
        // Create a dummy property type
        $propertyType = PropertyType::factory()->create([
            'name' => 'Test PropertyType',
            // Add other required fields here
        ]);

        // Call the getPropertyTypeById method
        $retrievedPropertyType = (new PropertyTypeService())->getPropertyTypeById($propertyType->id);

        // Assert that the retrieved property type is not null
        $this->assertNotNull($retrievedPropertyType);

        // Assert that the retrieved property type matches the created property type
        $this->assertEquals($propertyType->id, $retrievedPropertyType->id);
        $this->assertEquals($propertyType->name, $retrievedPropertyType->name);
        // Add assertions for other fields if needed
    }

    public function testUpdatePropertyType()
    {
        // Create dummy data and a property type
        $data = [
            'name' => $this->faker->word,
        ];
        $propertyType = PropertyType::factory()->create();

        // Call the updatePropertyType method
        $result = (new PropertyTypeService())->updatePropertyType($data, $propertyType->id);

        // Assert that the update operation was successful
        $this->assertTrue($result);

        // Retrieve the updated property type
        $updatedPropertyType = (new PropertyTypeService())->getPropertyTypeById($propertyType->id);

        // Assert that the updated property type matches the provided data
        $this->assertEquals($data['name'], $updatedPropertyType->name);
        // Add assertions for other fields if needed
    }

    public function testDeletePropertyType()
    {
        // Create a dummy property type
        $propertyType = PropertyType::factory()->create([
            'name' => 'test type',
        ]);

        // Call the deletePropertyType method
        $result = (new PropertyTypeService())->deletePropertyType($propertyType->id);

        // Assert that the delete operation was successful
        $this->assertTrue($result);

        // Assert that the property type no longer exists in the database
        $this->assertDatabaseMissing('property_types', ['id' => $propertyType->id]);
    }

 
}
