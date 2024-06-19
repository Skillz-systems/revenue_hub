T<?php

use PHPUnit\Framework\TestCase;
use App\Service\PropertyTypeService;
use App\Models\PropertyType;
use Illuminate\Support\Facades\Auth;
use Mockery;

class PropertyTypeServiceTest extends TestCase
{
    protected $propertyTypeService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->propertyTypeService = new PropertyTypeService();
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function testGetAllPropertyType()
    {
        $propertyTypes = Mockery::mock('alias:App\Models\PropertyType');
        $propertyTypes->shouldReceive('all')->andReturn(collect(['type1', 'type2']));

        $result = $this->propertyTypeService->getAllPropertyType();

        $this->assertCount(2, $result);
        $this->assertEquals('type1', $result[0]);
    }

    public function testCreate()
    {
        $data = ['name' => 'NewType'];
        $propertyType = Mockery::mock('alias:App\Models\PropertyType');
        $propertyType->shouldReceive('create')->with($data)->andReturn((object)$data);

        $result = $this->propertyTypeService->create($data);

        $this->assertEquals('NewType', $result->name);
    }

    public function testGetPropertyTypeFromPropertyTypeName()
    {
        $name = 'TypeName';
        $propertyType = Mockery::mock('alias:App\Models\PropertyType');
        $propertyType->shouldReceive('where')->with('name', $name)->andReturnSelf();
        $propertyType->shouldReceive('first')->andReturn((object)['name' => $name]);

        $result = $this->propertyTypeService->getPropertyTypeFromPropertyTypeName($name);

        $this->assertEquals($name, $result->name);
    }

    public function testGetPropertyTypeById()
    {
        $id = 1;
        $propertyType = Mockery::mock('alias:App\Models\PropertyType');
        $propertyType->shouldReceive('where')->with('id', $id)->andReturnSelf();
        $propertyType->shouldReceive('first')->andReturn((object)['id' => $id]);

        $result = $this->propertyTypeService->getPropertyTypeById($id);

        $this->assertEquals($id, $result->id);
    }

    public function testUpdatePropertyType()
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
    }

    public function testDeletePropertyType()
    {
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
}
