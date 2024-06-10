<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\CadastralZone;
use App\Service\CadastralZoneService;
use Faker\Factory as Faker;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CadastralZoneServiceTest extends TestCase
{
    use RefreshDatabase;

    protected $service;
    private  $faker;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new CadastralZoneService();
        $this->faker = Faker::create();
    }

    public function test_to_get__all_cadastral_zone()
    {
        // Create some dummy data
        CadastralZone::factory()->count(3)->create([
            'name' => "New Name",
            'rating_district_id' => '2',
        ]);

        // Call the method
        $cadastralZone = $this->service->getAllCadastralZone();

        // Assert that the method returns a collection of cadastral zone
        $this->assertInstanceOf(Collection::class, $cadastralZone);

        // Assert that the number of returned cadastral zone matches the number of created dummy data
        $this->assertEquals(3, $cadastralZone->count());
    }

    public function test_to_see_if_cadastral_zone_can_be_created()
    {
        // Data for creating a cadastral zone
        $data = [
            'name' => 'Test Cadastral Zone',
            'rating_district_id' => '2',
            // Add other required fields here
        ];

        // Call the create method
        $createdCadastralZone = $this->service->create($data);

        // Assert that a cadastral zone was created
        $this->assertNotNull($createdCadastralZone);

        // Assert that the created cadastral zone matches the data provided
        $this->assertEquals($data['name'], $createdCadastralZone->name);
        $this->assertEquals($data['rating_district_id'], $createdCadastralZone->rating_district_id);
        // Add assertions for other fields if needed
    }

    public function test_to_get_cadastral_zone_from_cadastral_zone_name()
    {
        // Create a dummy cadastral zone
        $cadastralZone = CadastralZone::factory()->create([
            'name' => "New Name",
            'rating_district_id' => '2',
        ]);

        // Call the getCadastralZoneFromCadastralZoneName method
        $retrievedCadastralZone = ($this->service)->getCadastralZoneFromZoneName('New Name');

        // Assert that the retrieved cadastral zone is not null
        $this->assertNotNull($retrievedCadastralZone);

        // Assert that the retrieved cadastral zone matches the created cadastral zone
        $this->assertEquals($cadastralZone->name, $retrievedCadastralZone->name);
        // Add assertions for other fields if needed
    }

    public function test_to_get_cadastral_zone_by_id()
    {
        // Create a dummy cadastral zone
        $cadastralZone = CadastralZone::factory()->create([
            'name' => 'Test Cadastral Zone',
            'rating_district_id' => '2',
            // Add other required fields here
        ]);

        // Call the getCadastralZoneById method
        $retrievedCadastralZone = $this->service->getCadastralZoneById($cadastralZone->id);

        // Assert that the retrieved cadastral zone is not null
        $this->assertNotNull($retrievedCadastralZone);

        // Assert that the retrieved cadastral zone matches the created cadastral zone
        $this->assertEquals($cadastralZone->id, $retrievedCadastralZone->id);
        $this->assertEquals($cadastralZone->name, $retrievedCadastralZone->name);
        $this->assertEquals($cadastralZone->cadastral_zone_id, $retrievedCadastralZone->cadastral_zone_id);
        // Add assertions for other fields if needed
    }

    public function test_to_update_cadastral_zone()
    {
        $data = [
            "name" => $this->faker->streetName(),
            "rating_district_id" =>  $this->faker->numberBetween(1, 9),
        ];
        $cadastralZone = CadastralZone::factory()->create([
            'name' => "New Name",
            'rating_district_id' => '2',
        ]);
        $updateCadastralZone = $this->service->updateCadastralZone($data, $cadastralZone->id);
        $this->assertEquals($updateCadastralZone, true);
    }

    public function test_delete_existing_cadastral_zone()
    {
        // Create a dummy cadastral zone
        $cadastralZone = CadastralZone::factory()->create([
            'name' => 'Test Cadastral Zone',
            'rating_district_id' => '2',
        ]);

        // Call the deleteCadastralZone method
        $result = $this->service->deleteCadastralZone($cadastralZone->id);

        // Assert that the delete operation was successful
        $this->assertTrue($result);

        // Assert that the cadastral zone no longer exists in the database
        $this->assertDatabaseMissing('cadastral_zones', ['id' => $cadastralZone->id]);
    }
}
