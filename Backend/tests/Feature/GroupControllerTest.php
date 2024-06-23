<?php

namespace Tests\Feature;

use Mockery;
use Tests\TestCase;
use App\Models\Role;
use App\Models\User;
use App\Models\Group;
use App\Mail\RegisterMail;
use App\Service\StaffService;
use App\Service\GroupService;
use App\Mail\ForgotPasswordMail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class GroupControllerTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    use RefreshDatabase;

    protected $groupService;

    protected function setUp(): void
    {
        parent::setUp();

        // Mock the groupservice
        $this->groupservice = $this->createMock(GroupService::class);
        $this->app->instance(GroupService::class, $this->groupservice);
    }

    /** @test */
    public function it_returns_groups_if_user_is_admin_or_md()
    {
        // Assume the user is an admin or MD
        $this->groupservice->method('checkIsAdminOrMd')->willReturn(true);

        // Assume the group service returns some groups
        $groups = Group::factory()->count(3)->make();
        $this->groupservice->method('getAllGroup')->willReturn($groups);

        $response = $this->actingAsTestUser()
            ->getJson('/api/group');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ])
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'created_at', 'updated_at']
                ]
            ]);
    }

    /** @test */
    public function it_returns_error_if_no_groups_found()
    {
        // Assume the user is an admin or MD
        $this->groupservice->method('checkIsAdminOrMd')->willReturn(true);

        // Assume the group service returns no groups
        $this->groupservice->method('getAllGroup')->willReturn(null);

        $response = $this->actingAsTestUser()
            ->getJson('/api/group');

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'No group found',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md()
    {
        // Assume the user is not an admin or MD
        $this->groupservice->method('checkIsAdminOrMd')->willReturn(false);

        $response = $this->actingAsTestUser()
            ->getJson('/api/group');

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You don\'t have permission',
            ]);
    }

    /** @test */
    public function it_creates_a_group_if_user_is_admin_or_md_and_data_is_valid()
    {
        // Assume the user is an admin or MD
        $this->groupservice->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the creation process
        $group = Group::factory()->make();
        $this->groupservice->method('create')->willReturn($group);

        $data = [
            'name' => 'Test Group',
        ];

        $response = $this->actingAsTestUser()
            ->postJson('/api/group/create', $data);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ])
            ->assertJsonStructure([
                'data' => ['id', 'name', 'created_at', 'updated_at']
            ]);
    }

    /** @test */
    public function it_returns_error_if_group_creation_validation_fails()
    {
        // Assume the user is an admin or MD
        $this->groupservice->method('checkIsAdminOrMd')->willReturn(true);

        $data = [
            'name' => '',  // Invalid data
        ];

        $response = $this->actingAsTestUser()
            ->postJson('/api/group/create', $data);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'All fields are required',
            ])
            ->assertJsonStructure(['data']);
    }

    /** @test */
    public function it_returns_error_if_group_creation_fails()
    {
        // Assume the user is an admin or MD
        $this->groupservice->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the creation process to fail
        $this->groupservice->method('create')->willReturn(null);

        $data = [
            'name' => 'Test Group',
        ];

        $response = $this->actingAsTestUser()
            ->postJson('/api/group/create', $data);

        $response->assertStatus(500)
            ->assertJson([
                'status' => 'error',
                'message' => 'An error occurred',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_group_creation()
    {
        // Assume the user is not an admin or MD
        $this->groupservice->method('checkIsAdminOrMd')->willReturn(false);

        $data = [
            'name' => 'Test Group',
        ];

        $response = $this->actingAsTestUser()
            ->postJson('/api/group/create', $data);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You don\'t have permission',
            ]);
    }

    /** @test */
    public function it_returns_a_group_if_user_is_admin_or_md_and_group_exists()
    {
        // Assume the user is an admin or MD
        $this->groupservice->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the group
        $group = Group::factory()->make();
        $this->groupservice->method('getGroupById')->willReturn($group);

        $response = $this->actingAsTestUser()
            ->getJson('/api/group/view/1');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ])
            ->assertJsonStructure([
                'data' => ['id', 'name', 'created_at', 'updated_at']
            ]);
    }

    /** @test */
    public function it_returns_error_if_group_not_found()
    {
        // Assume the user is an admin or MD
        $this->groupservice->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the group not found
        $this->groupservice->method('getGroupById')->willReturn(null);

        $response = $this->actingAsTestUser()
            ->getJson('/api/group/view/999');

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'No group found',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_view_group()
    {
        // Assume the user is not an admin or MD
        $this->groupservice->method('checkIsAdminOrMd')->willReturn(false);

        $response = $this->actingAsTestUser()
            ->getJson('/api/group/view/1');

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You don\'t have permission',
            ]);
    }

    /** @test */
    public function it_updates_a_group_if_user_is_admin_or_md_and_data_is_valid()
    {
        // Assume the user is an admin or MD
        $this->groupservice->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the update process
        $group = Group::factory()->create();
        $this->groupservice->method('updateGroup')->willReturn(true);

        $data = [
            'name' => 'Updated Group Name',
        ];

        $response = $this->actingAsTestUser()
            ->putJson('/api/group/update/' . $group->id, $data);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Group updated successfully',
            ]);
    }

    /** @test */
    public function it_returns_error_if_validation_fails()
    {
        // Assume the user is an admin or MD
        $this->groupservice->method('checkIsAdminOrMd')->willReturn(true);

        $data = [
            'name' => '',  // Invalid data
        ];

        $response = $this->actingAsTestUser()
            ->putJson('/api/group/update/1', $data);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'All fields are required',
            ])
            ->assertJsonStructure(['data']);
    }

    /** @test */
    public function it_returns_error_if_group_update_fails()
    {
        // Assume the user is an admin or MD
        $this->groupservice->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the update process to fail
        $this->groupservice->method('updateGroup')->willReturn(false);

        $group = Group::factory()->create();
        $data = [
            'name' => 'Updated Group Name',
        ];

        $response = $this->actingAsTestUser()
            ->putJson('/api/group/update/' . $group->id, $data);

        $response->assertStatus(500)
            ->assertJson([
                'status' => 'error',
                'message' => 'An error occurred',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_update_group()
    {
        // Assume the user is not an admin or MD
        $this->groupservice->method('checkIsAdminOrMd')->willReturn(false);

        $group = Group::factory()->create();
        $data = [
            'name' => 'Updated Group Name',
        ];

        $response = $this->actingAsTestUser()
            ->putJson('/api/group/update/' . $group->id, $data);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You don\'t have permission',
            ]);
    }

    /** @test */
    public function it_deletes_a_group_if_user_is_admin_or_md()
    {
        // Assume the user is an admin or MD
        $this->groupservice->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the delete process
        $this->groupservice->method('deleteGroup')->willReturn(true);

        $group = Group::factory()->create();

        $response = $this->actingAsTestUser()
            ->deleteJson('/api/group/delete/' . $group->id);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Group deleted successfully',
            ]);
    }

    /** @test */
    public function it_returns_error_if_group_deletion_fails()
    {
        // Assume the user is an admin or MD
        $this->groupservice->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the delete process to fail
        $this->groupservice->method('deleteGroup')->willReturn(false);

        $group = Group::factory()->create();

        $response = $this->actingAsTestUser()
            ->deleteJson('/api/group/delete/' . $group->id);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'An error occurred',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_delete_group()
    {
        // Assume the user is not an admin or MD
        $this->groupservice->method('checkIsAdminOrMd')->willReturn(false);

        $group = Group::factory()->create();

        $response = $this->actingAsTestUser()
            ->deleteJson('/api/group/delete/' . $group->id);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You don\'t have permission',
            ]);
    }
}
