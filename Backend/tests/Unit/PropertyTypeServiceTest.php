use Illuminate\Database\Eloquent\Collection;
T<?php

    use App\Models\User;
    use App\Models\PropertyType;
    use PHPUnit\Framework\TestCase;
    use App\Service\PropertyTypeService;
    use Illuminate\Foundation\Testing\RefreshDatabase;
    use Illuminate\Database\Eloquent\Collection;
    use Illuminate\Support\Facades\Auth;

    class PropertyTypeServiceTest extends TestCase
    {
        use RefreshDatabase;
        protected $propertyTypeService;

        public function setUp(): void
        {
            parent::setUp();
            $this->propertyTypeService = new PropertyTypeService();
        }

        public function test_get_all_property_type()
        {
            PropertyType::factory()->count(2)->create();
            $result = $this->propertyTypeService->getAllPropertyType();
            $this->assertInstanceOf(Collection::class, $result);
            $this->assertCount(2, $result);
        }

        /*public function testGetAllPropertyType()
        {
            $propertyTypes = Mockery::mock('alias:App\Models\PropertyType');
            $propertyTypes->shouldReceive('all')->andReturn(collect(['type1', 'type2']));

            $result = $this->propertyTypeService->getAllPropertyType();

            $this->assertCount(2, $result);
            $this->assertEquals('type1', $result[0]);
        }*/

        /*public function testCreate()
        {
            $data = ['name' => 'NewType'];
            $propertyType = Mockery::mock('alias:App\Models\PropertyType');
            $propertyType->shouldReceive('create')->with($data)->andReturn((object)$data);

            $result = $this->propertyTypeService->create($data);

            $this->assertEquals('NewType', $result->name);
        }*/

        /*public function testGetPropertyTypeFromPropertyTypeName()
        {
            $name = 'TypeName';
            $propertyType = Mockery::mock('alias:App\Models\PropertyType');
            $propertyType->shouldReceive('where')->with('name', $name)->andReturnSelf();
            $propertyType->shouldReceive('first')->andReturn((object)['name' => $name]);

            $result = $this->propertyTypeService->getPropertyTypeFromPropertyTypeName($name);

            $this->assertEquals($name, $result->name);
        }*/

        /*public function testGetPropertyTypeById()
        {
            $id = 1;
            $propertyType = Mockery::mock('alias:App\Models\PropertyType');
            $propertyType->shouldReceive('where')->with('id', $id)->andReturnSelf();
            $propertyType->shouldReceive('first')->andReturn((object)['id' => $id]);

            $result = $this->propertyTypeService->getPropertyTypeById($id);

            $this->assertEquals($id, $result->id);
        }*/

        /*public function testUpdatePropertyType()
        {
            $id = 1;
            $data = ['name' => 'UpdatedName'];
            $propertyType = Mockery::mock('alias:App\Models\PropertyType');
            $propertyTypeInstance = Mockery::mock();
            $propertyTypeInstance->shouldReceive('update')->with($data)->andReturn(true);
            $propertyType->shouldReceive('where')->with('id', $id)->andReturnSelf();
            $propertyType->shouldReceive('first')->andReturn($propertyTypeInstance);

            $result = $this->propertyTypeService->updatePropertyType($data, $id);

            $this->assertTrue($result);
        }*/

        /*public function testDeletePropertyType()
        {
            $id = 1;
            $propertyType = Mockery::mock('alias:App\Models\PropertyType');
            $propertyTypeInstance = Mockery::mock();
            $propertyTypeInstance->shouldReceive('delete')->andReturn(true);
            $propertyType->shouldReceive('where')->with('id', $id)->andReturnSelf();
            $propertyType->shouldReceive('first')->andReturn($propertyTypeInstance);

            $result = $this->propertyTypeService->deletePropertyType($id);

            $this->assertTrue($result);
        }*/

        /*public function testCheckIsAdminOrMd()
        {
            $user = Mockery::mock('alias:App\Models\User');
            $user->role_id = User::ROLE_ADMIN;
            Auth::shouldReceive('user')->andReturn($user);

            $result = $this->propertyTypeService->checkIsAdminOrMd();

            $this->assertTrue($result);
        }*/
    }
