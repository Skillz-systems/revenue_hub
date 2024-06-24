<<<<<<< HEAD
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
=======
T<?php

use PHPUnit\Framework\TestCase;
use App\Service\PropertyTypeService;
use App\Models\PropertyType;
use Illuminate\Support\Facades\Auth;
use Mockery;

class PropertyTypeServiceTest extends TestCase
{
    protected $propertyTypeService;
>>>>>>> 7030308 (crud for property type)

    protected function setUp(): void
    {
        parent::setUp();
<<<<<<< HEAD
        $this->service = new PropertyTypeService();
        $this->faker = Faker::create();
=======

        $this->propertyTypeService = new PropertyTypeService();
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
>>>>>>> 7030308 (crud for property type)
    }

    public function testGetAllPropertyType()
    {
<<<<<<< HEAD
        // Create some dummy data
        PropertyType::factory()->count(2)->create();

        // Call the method
        $propertyTypes = $this->service->getAllPropertyType();

        // Assert that the method returns a collection of property types
        $this->assertInstanceOf(Collection::class, $propertyTypes);

        // Assert that the number of returned property types matches the number of created dummy data
        $this->assertEquals(2, $propertyTypes->count());
=======
        $propertyTypes = Mockery::mock('alias:App\Models\PropertyType');
        $propertyTypes->shouldReceive('all')->andReturn(collect(['type1', 'type2']));

        $result = $this->propertyTypeService->getAllPropertyType();

        $this->assertCount(2, $result);
        $this->assertEquals('type1', $result[0]);
>>>>>>> 7030308 (crud for property type)
    }

    public function testCreate()
    {
<<<<<<< HEAD
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
=======
        $data = ['name' => 'NewType'];
        $propertyType = Mockery::mock('alias:App\Models\PropertyType');
        $propertyType->shouldReceive('create')->with($data)->andReturn((object)$data);

        $result = $this->propertyTypeService->create($data);

        $this->assertEquals('NewType', $result->name);
>>>>>>> 7030308 (crud for property type)
    }

    public function testGetPropertyTypeFromPropertyTypeName()
    {
<<<<<<< HEAD
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
=======
        $name = 'TypeName';
        $propertyType = Mockery::mock('alias:App\Models\PropertyType');
        $propertyType->shouldReceive('where')->with('name', $name)->andReturnSelf();
        $propertyType->shouldReceive('first')->andReturn((object)['name' => $name]);

        $result = $this->propertyTypeService->getPropertyTypeFromPropertyTypeName($name);

        $this->assertEquals($name, $result->name);
>>>>>>> 7030308 (crud for property type)
    }

    public function testGetPropertyTypeById()
    {
<<<<<<< HEAD
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
=======
        $id = 1;
        $propertyType = Mockery::mock('alias:App\Models\PropertyType');
        $propertyType->shouldReceive('where')->with('id', $id)->andReturnSelf();
        $propertyType->shouldReceive('first')->andReturn((object)['id' => $id]);

        $result = $this->propertyTypeService->getPropertyTypeById($id);

        $this->assertEquals($id, $result->id);
>>>>>>> 7030308 (crud for property type)
    }

    public function testUpdatePropertyType()
    {
<<<<<<< HEAD
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
=======
        $id = 1;
        $data = ['name' => 'UpdatedName'];
        $propertyType = Mockery::mock('alias:App\Models\PropertyType');
        $propertyTypeInstance = Mockery::mock();
        $propertyTypeInstance->shouldReceive('update')->with($data)->andReturn(true);
        $propertyType->shouldReceive('where')->with('id', $id)->andReturnSelf();
        $propertyType->shouldReceive('first')->andReturn($propertyTypeInstance);

        $result = $this->propertyTypeService->updatePropertyType($data, $id);

        $this->assertTrue($result);
>>>>>>> 7030308 (crud for property type)
    }

    public function testDeletePropertyType()
    {
<<<<<<< HEAD
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

 
=======
        $id = 1;
        $propertyType = Mockery::mock('alias:App\Models\PropertyType');
        $propertyTypeInstance = Mockery::mock();
        $propertyTypeInstance->shouldReceive('delete')->andReturn(true);
        $propertyType->shouldReceive('where')->with('id', $id)->andReturnSelf();
        $propertyType->shouldReceive('first')->andReturn($propertyTypeInstance);

        $result = $this->propertyTypeService->deletePropertyType($id);

        $this->assertTrue($result);
    }

    public function testCheckIsAdminOrMd()
    {
        $user = Mockery::mock('alias:App\Models\User');
        $user->role_id = User::ROLE_ADMIN;
        Auth::shouldReceive('user')->andReturn($user);

        $result = $this->propertyTypeService->checkIsAdminOrMd();

        $this->assertTrue($result);
    }
>>>>>>> 7030308 (crud for property type)
}
