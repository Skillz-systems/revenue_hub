<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Group;
use App\Models\User;
use App\Service\GroupService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;

class GroupServiceTest extends TestCase
{
    use RefreshDatabase;

    protected $groupService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->groupService = new GroupService();
    }

    /** @test */
    public function it_can_get_all_groups()
    {
        $groups = Group::factory()->count(3)->create();

        $result = $this->groupService->getAllGroup();

        $this->assertCount(3, $result);
    }

    /** @test */
    public function it_can_create_a_group()
    {
        $data = [
            'name' => 'Test Group',
        ];

        $group = $this->groupService->create($data);

        $this->assertDatabaseHas('groups', $data);
    }

    /** @test */
    public function it_can_get_a_group_by_id()
    {
        $group = Group::factory()->create();

        $result = $this->groupService->getGroupById($group->id);

        $this->assertNotNull($result);
        $this->assertEquals($group->id, $result->id);
    }

    /** @test */
    public function it_returns_null_if_group_not_found_by_id()
    {
        $result = $this->groupService->getGroupById(999);

        $this->assertNull($result);
    }

    /** @test */
    public function it_can_update_a_group()
    {
        $group = Group::factory()->create();
        $data = ['name' => 'Updated Group'];

        $result = $this->groupService->updateGroup($data, $group->id);

        $this->assertTrue($result);
        $this->assertDatabaseHas('groups', ['id' => $group->id, 'name' => 'Updated Group']);
    }

    /** @test */
    public function it_throws_exception_if_group_not_found_for_update()
    {
        $this->expectException(\Exception::class);

        $this->groupService->updateGroup(['name' => 'Updated Group'], 999);
    }

    /** @test */
    public function it_can_delete_a_group()
    {
        $group = Group::factory()->create();

        $result = $this->groupService->deleteGroup($group->id);

        $this->assertTrue($result);
        $this->assertDatabaseMissing('groups', ['id' => $group->id]);
    }

    /** @test */
    public function it_throws_exception_if_group_not_found_for_delete()
    {
        $this->expectException(\Exception::class);

        $this->groupService->deleteGroup(999);
    }
}
