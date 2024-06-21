<?php

namespace Tests\Unit;

use App\Service\PropertyTypeService;
use Tests\TestCase;
use App\Models\PropertyType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\App;

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
        $this->assertCount(2, $result);
    }

    public function test_create_property_type()
    {
        $data = ['name' => 'Type1'];
        $result = $this->propertyTypeService->create($data);
        $this->assertDatabaseHas('property_types', $data);
    }

    public function test_get_property_type_from_property_type_name()
    {
        $name = 'Type1';
        PropertyType::factory()->create(['name' => $name]);
        $result = $this->propertyTypeService->getPropertyTypeFromPropertyTypeName($name);
        $this->assertEquals($name, $result->name);
    }

    public function test_get_property_type_by_id()
    {
        $propertyType = PropertyType::factory()->create();
        $result = $this->propertyTypeService->getPropertyTypeById($propertyType->id);
        $this->assertEquals($propertyType->id, $result->id);
    }

    public function test_update_property_type()
    {
        $propertyType = PropertyType::factory()->create();
        $data = ['name' => 'UpdatedType'];
        $result = $this->propertyTypeService->updatePropertyType($data, $propertyType->id);
        $this->assertTrue($result);
        $this->assertDatabaseHas('property_types', ['id' => $propertyType->id, 'name' => 'UpdatedType']);
    }

    public function test_delete_property_type()
    {
        $propertyType = PropertyType::factory()->create();
        $result = $this->propertyTypeService->deletePropertyType($propertyType->id);
        $this->assertTrue($result);
        $this->assertDatabaseMissing('property_types', ['id' => $propertyType->id]);
    }
}
