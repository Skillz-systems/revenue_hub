<?php

namespace Tests\Unit;

use App\Models\Group;
use App\Models\User;
use App\Service\GroupService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class GroupServiceTest extends TestCase
{
    use RefreshDatabase;

    protected $groupService;
    protected $admin;
    protected $md;
    protected $user;
    protected $group;

    protected function setUp(): void
    {
        parent::setUp();

        // Create service instance
        $this->groupService = new GroupService();

        // Create test users
        $this->admin = User::factory()->create(['role_id' => User::ROLE_ADMIN]);
        $this->md = User::factory()->create(['role_id' => User::ROLE_MD]);
        $this->user = User::factory()->create(['role_id' => User::ROLE_USER]);

        // Create test group
        $this->group = Group::factory()->create();
    }

    /** @test */
    public function it_can_get_all_groups()
    {
        Group::factory()->count(5)->create();
        $groups = $this->groupService->getAllGroup();
        $this->assertCount(6, $groups); // Including the group created in setUp
    }

    /** @test */
    public function it_can_create_a_group()
    {
        $data = ['name' => 'Test Group'];
        $group = $this->groupService->create($data);

        $this->assertInstanceOf(Group::class, $group);
        $this->assertDatabaseHas('groups', ['name' => 'Test Group']);
    }

    /** @test */
    public function it_can_get_group_by_name()
    {
        $group = $this->groupService->getGroupFromGroupName($this->group->name);

        $this->assertInstanceOf(Group::class, $group);
        $this->assertEquals($this->group->name, $group->name);
    }

    /** @test */
    public function it_can_get_group_by_id()
    {
        $group = $this->groupService->getGroupById($this->group->id);

        $this->assertInstanceOf(Group::class, $group);
        $this->assertEquals($this->group->id, $group->id);
    }

    /** @test */
    public function it_can_update_group()
    {
        $data = ['name' => 'Updated Group'];
        $updated = $this->groupService->updateGroup($data, $this->group->id);

        $this->assertTrue($updated);
        $this->assertDatabaseHas('groups', ['name' => 'Updated Group']);
    }

    /** @test */
    public function it_throws_exception_when_updating_non_existent_group()
    {
        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Group not found with ID: 999');

        $data = ['name' => 'Non Existent Group'];
        $this->groupService->updateGroup($data, 999);
    }

    /** @test */
    public function it_can_delete_group()
    {
        $deleted = $this->groupService->deleteGroup($this->group->id);

        $this->assertTrue($deleted);
        $this->assertDatabaseMissing('groups', ['id' => $this->group->id]);
    }

    /** @test */
    public function it_throws_exception_when_deleting_non_existent_group()
    {
        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Group not found with ID: 999');

        $this->groupService->deleteGroup(999);
    }

    /** @test */
    public function it_checks_if_user_is_admin_or_md()
    {
        Auth::shouldReceive('user')->andReturn($this->admin);
        $this->assertTrue($this->groupService->checkIsAdminOrMd());

        Auth::shouldReceive('user')->andReturn($this->md);
        $this->assertTrue($this->groupService->checkIsAdminOrMd());

        Auth::shouldReceive('user')->andReturn($this->user);
        $this->assertFalse($this->groupService->checkIsAdminOrMd());
    }
}
