<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\OfficeZone;
use App\Service\OfficeZoneService;
use Faker\Factory as Faker;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OfficeZoneServiceTest extends TestCase
{
    use RefreshDatabase;

    protected $service;
    private  $faker;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new OfficeZoneService();
        $this->faker = Faker::create();
    }

    public function test_to_get__all_office_zone()
    {
        // Create some dummy data
        OfficeZone::factory()->count(3)->create([
            'name' => "New Name",
            'address' => 'New Address',
        ]);

        // Call the method
        $officeZone = $this->service->getAllOfficeZone();

        // Assert that the method returns a collection of office zone
        $this->assertInstanceOf(Collection::class, $officeZone);

        // Assert that the number of returned office zone matches the number of created dummy data
        $this->assertEquals(3, $officeZone->count());
    }

    public function test_to_see_if_office_zone_can_be_created()
    {
        // Data for creating a office zone
        $data = [
            'name' => 'Test Office Zone',
            'address' => 'New Address',
            // Add other required fields here
        ];

        // Call the create method
        $createdOfficeZone = $this->service->create($data);

        // Assert that a office zone was created
        $this->assertNotNull($createdOfficeZone);

        // Assert that the created office zone matches the data provided
        $this->assertEquals($data['name'], $createdOfficeZone->name);
        $this->assertEquals($data['address'], $createdOfficeZone->address);
        // Add assertions for other fields if needed
    }

    public function test_to_get_office_zone_from_office_zone_name()
    {
        // Create a dummy office zone
        $officeZone = OfficeZone::factory()->create([
            'name' => "New Name",
            'address' => 'New Address',
        ]);

        // Call the getOfficeZoneFromOfficeZoneName method
        $retrievedOfficeZone = ($this->service)->getOfficeZoneFromZoneName('New Name');

        // Assert that the retrieved office zone is not null
        $this->assertNotNull($retrievedOfficeZone);

        // Assert that the retrieved office zone matches the created office zone
        $this->assertEquals($officeZone->name, $retrievedOfficeZone->name);
        // Add assertions for other fields if needed
    }

    public function test_to_get_office_zone_by_id()
    {
        // Create a dummy office zone
        $officeZone = OfficeZone::factory()->create([
            'name' => 'Test Office Zone',
            'address' => 'New Address',
            // Add other required fields here
        ]);

        // Call the getOfficeZoneById method
        $retrievedOfficeZone = $this->service->getOfficeZoneById($officeZone->id);

        // Assert that the retrieved office zone is not null
        $this->assertNotNull($retrievedOfficeZone);

        // Assert that the retrieved office zone matches the created office zone
        $this->assertEquals($officeZone->id, $retrievedOfficeZone->id);
        $this->assertEquals($officeZone->name, $retrievedOfficeZone->name);
        $this->assertEquals($officeZone->office_zone_id, $retrievedOfficeZone->office_zone_id);
        // Add assertions for other fields if needed
    }

    public function test_to_update_office_zone()
    {
        $data = [
            "name" => $this->faker->streetName(),
            "address" =>  $this->faker->numberBetween(1, 9),
        ];
        $officeZone = OfficeZone::factory()->create([
            'name' => "New Name",
            'address' => 'New Address',
        ]);
        $updateOfficeZone = $this->service->updateOfficeZone($data, $officeZone->id);
        $this->assertEquals($updateOfficeZone, true);
    }

    public function test_delete_existing_office_zone()
    {
        // Create a dummy office zone
        $officeZone = OfficeZone::factory()->create([
            'name' => 'Test Office Zone',
            'address' => 'New Address',
        ]);

        // Call the deleteOfficeZone method
        $result = $this->service->deleteOfficeZone($officeZone->id);

        // Assert that the delete operation was successful
        $this->assertTrue($result);

        // Assert that the office zone no longer exists in the database
        $this->assertDatabaseMissing('office_zones', ['id' => $officeZone->id]);
    }
}
