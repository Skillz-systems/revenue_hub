<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Street;
use Faker\Factory as Faker;
use App\Service\StreetService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;

class StreetServiceTest extends TestCase
{
    use RefreshDatabase;

    protected $service;
    private  $faker;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new StreetService();
        $this->faker = Faker::create();
    }

    public function test_to_get__all_street()
    {
        // Create some dummy data
        Street::factory()->count(3)->create();

        // Call the method
        $streets = $this->service->getAllStreet();

        // Assert that the method returns a collection of streets
        $this->assertInstanceOf(Collection::class, $streets);

        // Assert that the number of returned streets matches the number of created dummy data
        $this->assertEquals(3, $streets->count());
    }

    public function test_to_see_if_street_can_be_created()
    {
        // Data for creating a street
        $data = [
            'name' => 'Test Street',
            'cadastral_zone_id' => '2',
            // Add other required fields here
        ];

        // Call the create method
        $createdStreet = $this->service->create($data);

        // Assert that a street was created
        $this->assertNotNull($createdStreet);

        // Assert that the created street matches the data provided
        $this->assertEquals($data['name'], $createdStreet->name);
        $this->assertEquals($data['cadastral_zone_id'], $createdStreet->cadastral_zone_id);
        // Add assertions for other fields if needed
    }

    public function test_to_get_street_from_street_name()
    {
        // Create a dummy street
        $street = Street::factory()->create([
            'name' => 'Test Street',
            // Add other required fields here
        ]);

        // Call the getStreetFromStreetName method
        $retrievedStreet = (new StreetService())->getStreetFromStreetName('Test Street');

        // Assert that the retrieved street is not null
        $this->assertNotNull($retrievedStreet);

        // Assert that the retrieved street matches the created street
        $this->assertEquals($street->name, $retrievedStreet->name);
        // Add assertions for other fields if needed
    }

    public function test_to_get_street_by_id()
    {
        // Create a dummy street
        $street = Street::factory()->create([
            'name' => 'Test Street',
            'cadastral_zone_id' => '2',
            // Add other required fields here
        ]);

        // Call the getStreetById method
        $retrievedStreet = (new StreetService())->getStreetById($street->id);

        // Assert that the retrieved street is not null
        $this->assertNotNull($retrievedStreet);

        // Assert that the retrieved street matches the created street
        $this->assertEquals($street->id, $retrievedStreet->id);
        $this->assertEquals($street->name, $retrievedStreet->name);
        $this->assertEquals($street->cadastral_zone_id, $retrievedStreet->cadastral_zone_id);
        // Add assertions for other fields if needed
    }

    public function test_to_update_street()
    {
        $data = [
            "name" => $this->faker->streetName(),
            "cadastral_zone_id" =>  $this->faker->numberBetween(1, 9),
        ];
        $street = Street::factory()->create();
        $updateDemandNotice = (new StreetService())->updateStreet($data, $street->id);
        $this->assertEquals($updateDemandNotice, true);
    }

    public function test_delete_existing_street()
    {
        // Create a dummy street
        $street = Street::factory()->create([
            'name' => 'Test Street',
            'cadastral_zone_id' => '2',
        ]);

        // Call the deleteStreet method
        $result = (new StreetService())->deleteStreet($street->id);

        // Assert that the delete operation was successful
        $this->assertTrue($result);

        // Assert that the street no longer exists in the database
        $this->assertDatabaseMissing('streets', ['id' => $street->id]);
    }
}
