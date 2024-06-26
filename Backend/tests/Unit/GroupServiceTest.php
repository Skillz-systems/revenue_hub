<?php

namespace Tests\Unit\Service;

use Tests\TestCase;
use App\Models\User;
use App\Models\Group;
use Faker\Factory as Faker;
use App\Service\GroupService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Testing\Fakes\Fake;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;

class GroupServiceTest extends TestCase
{
    use RefreshDatabase;

    protected $service;
    protected $faker;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new GroupService();
        $this->faker = Faker::create();
    }

    public function testGetAllGroup()
    {
        // Create some dummy data
        Group::factory()->count(2)->create();

        // Call the method
        $groups = $this->service->getAllGroup();

        // Assert that the method returns a collection of groups
        $this->assertInstanceOf(Collection::class, $groups);

        // Assert that the number of returned groups matches the number of created dummy data
        $this->assertEquals(2, $groups->count());
    }

    public function testCreate()
    {
        // Data for creating a group
        $data = [
            'name' => $this->faker->word,
            // Add other required fields here
        ];

        // Call the create method
        $createdGroup = $this->service->create($data);

        // Assert that a group was created
        $this->assertNotNull($createdGroup);

        // Assert that the created group matches the data provided
        $this->assertEquals($data['name'], $createdGroup->name);
        // Add assertions for other fields if needed
    }

    public function testGetGroupFromGroupName()
    {
        // Create a dummy group
        $group = Group::factory()->create([
            'name' => 'Test Group',
            // Add other required fields here
        ]);

        // Call the getGroupFromGroupName method
        $retrievedGroup = (new GroupService())->getGroupFromGroupName('Test Group');
        
        // Assert that the retrieved group is not null
        $this->assertNotNull($retrievedGroup);

        // Assert that the retrieved group matches the created group
        $this->assertEquals($group->name, $retrievedGroup->name);
        // Add assertions for other fields if needed
    }

    public function testGetGroupById()
    {
        // Create a dummy group
        $group = Group::factory()->create([
            'name' => 'Test Group',
            // Add other required fields here
        ]);

        // Call the getGroupById method
        $retrievedGroup = (new GroupService())->getGroupById($group->id);

        // Assert that the retrieved group is not null
        $this->assertNotNull($retrievedGroup);

        // Assert that the retrieved group matches the created group
        $this->assertEquals($group->id, $retrievedGroup->id);
        $this->assertEquals($group->name, $retrievedGroup->name);
        // Add assertions for other fields if needed
    }

    public function testUpdateGroup()
    {
        // Create dummy data and a group
        $data = [
            'name' => $this->faker->word,
        ];
        $group = Group::factory()->create();

        // Call the updateGroup method
        $result = (new GroupService())->updateGroup($data, $group->id);

        // Assert that the update operation was successful
        $this->assertTrue($result);

        // Retrieve the updated group
        $updatedGroup = (new GroupService())->getGroupById($group->id);

        // Assert that the updated group matches the provided data
        $this->assertEquals($data['name'], $updatedGroup->name);
        // Add assertions for other fields if needed
    }

    public function testDeleteGroup()
    {
        // Create a dummy group
        $group = Group::factory()->create([
            'name' => 'group type',
        ]);

        // Call the deleteGroup method
        $result = (new GroupService())->deleteGroup($group->id);

        // Assert that the delete operation was successful
        $this->assertTrue($result);

        // Assert that the group no longer exists in the database
        $this->assertDatabaseMissing('groups', ['id' => $group->id]);
    }
}
