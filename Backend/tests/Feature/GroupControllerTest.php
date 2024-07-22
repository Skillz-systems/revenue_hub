<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Group;
use App\Service\GroupService;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class GroupControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $groupService;

    protected function setUp(): void
    {
        parent::setUp();

        // Mock the groupService
        $this->groupService = $this->createMock(GroupService::class);
        $this->app->instance(GroupService::class, $this->groupService);
    }

    /** @test */
    public function it_returns_groups_if_user_is_admin_or_md()
    {
        $this->groupService->method('checkIsAdminOrMd')->willReturn(true);
        $groups = Group::factory()->count(3)->create();
        $this->groupService->method('getAllGroup')->willReturn($groups);

        $response = $this->actingAsTestUser()->getJson('/api/group');

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
        $this->groupService->method('checkIsAdminOrMd')->willReturn(true);
        $this->groupService->method('getAllGroup')->willReturn(null);

        $response = $this->actingAsTestUser()->getJson('/api/group');

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'No group found',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md()
    {
        $this->groupService->method('checkIsAdminOrMd')->willReturn(false);

        $response = $this->actingAsTestUser()->getJson('/api/group');

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You don\'t have permission',
            ]);
    }

    /** @test */
    public function it_creates_a_group_if_user_is_admin_or_md_and_data_is_valid()
    {
        $this->groupService->method('checkIsAdminOrMd')->willReturn(true);

        $group = Group::factory()->make([
            'id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $this->groupService->method('create')->willReturn($group);

        $data = ['name' => 'Test Group'
                ];

        $response = $this->actingAsTestUser()->postJson('/api/group/create', $data);

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
        $this->groupService->method('checkIsAdminOrMd')->willReturn(true);

        $data = ['name' => ''];

        $response = $this->actingAsTestUser()->postJson('/api/group/create', $data);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'All fields are required',
            ]);
    }

    /** @test */
    public function it_returns_error_if_group_creation_fails()
    {
        $this->groupService->method('checkIsAdminOrMd')->willReturn(true);
        $this->groupService->method('create')->willReturn(null);

        $data = ['name' => 'Test Group',
                ];

        $response = $this->actingAsTestUser()->postJson('/api/group/create', $data);

        $response->assertStatus(500)
            ->assertJson([
                'status' => 'error',
                'message' => 'An error occurred',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_group_creation()
    {
        $this->groupService->method('checkIsAdminOrMd')->willReturn(false);

        $data = ['name' => 'Test Group',
                ];

        $response = $this->actingAsTestUser()->postJson('/api/group/create', $data);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You don\'t have permission',
            ]);
    }

    /** @test */
    public function it_returns_a_group_if_user_is_admin_or_md_and_group_exists()
    {
        $this->groupService->method('checkIsAdminOrMd')->willReturn(true);

        $group = Group::factory()->make();
        $this->groupService->method('getGroupById')->willReturn($group);

        $response = $this->actingAsTestUser()->getJson('/api/group/view/1' . $group->id);

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
        $this->groupService->method('checkIsAdminOrMd')->willReturn(true);
        $this->groupService->method('getGroupById')->willReturn(null);

        $response = $this->actingAsTestUser()->getJson('/api/group/view/999');

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'No group found',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_view_group()
    {
        $this->groupService->method('checkIsAdminOrMd')->willReturn(false);

        $response = $this->actingAsTestUser()->getJson('/api/group/view/1');

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You don\'t have permission',
            ]);
    }

    /** @test */
    public function it_updates_a_group_if_user_is_admin_or_md_and_data_is_valid()
    {
        $this->groupService->method('checkIsAdminOrMd')->willReturn(true);

        $group = Group::factory()->create();
        $this->groupService->method('updateGroup')->willReturn(true);

        $data = ['name' => 'Updated Group Name',
                ];

        $response = $this->actingAsTestUser()->putJson('/api/group/update/' . $group->id, $data);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Group updated successfully',
            ]);
    }

    /** @test */
    public function it_returns_error_if_validation_fails()
    {
        $this->groupService->method('checkIsAdminOrMd')->willReturn(true);

        $data = ['name' => '',
                ];

        $response = $this->actingAsTestUser()->putJson('/api/group/update/1', $data);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'All fields are required',
            ]);
    }

    /** @test */
    public function it_returns_error_if_group_update_fails()
    {
        $this->groupService->method('checkIsAdminOrMd')->willReturn(true);
        $this->groupService->method('updateGroup')->willReturn(false);

        $group = Group::factory()->create();
        $data = ['name' => 'Updated Group Name',
                ];

        $response = $this->actingAsTestUser()->putJson('/api/group/update/' . $group->id, $data);

        $response->assertStatus(500)
            ->assertJson([
                'status' => 'error',
                'message' => 'An error occurred',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_update_group()
    {
        $this->groupService->method('checkIsAdminOrMd')->willReturn(false);

        $group = Group::factory()->create();
        $data = ['name' => 'Updated Group Name',
                 
                ];

        $response = $this->actingAsTestUser()->putJson('/api/group/update/' . $group->id, $data);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You don\'t have permission',
            ]);
    }

    /** @test */
    public function it_deletes_a_group_if_user_is_admin_or_md()
    {
        $this->groupService->method('checkIsAdminOrMd')->willReturn(true);
        $this->groupService->method('deleteGroup')->willReturn(true);

        $group = Group::factory()->create();

        $response = $this->actingAsTestUser()->deleteJson('/api/group/delete/' . $group->id);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Group deleted successfully',
            ]);
    }

    /** @test */
    public function it_returns_error_if_group_deletion_fails()
    {
        $this->groupService->method('checkIsAdminOrMd')->willReturn(true);
        $this->groupService->method('deleteGroup')->willReturn(false);

        $group = Group::factory()->create();

        $response = $this->actingAsTestUser()->deleteJson('/api/group/delete/' . $group->id);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'An error occurred',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_delete_group()
    {
        $this->groupService->method('checkIsAdminOrMd')->willReturn(false);

        $group = Group::factory()->create();

        $response = $this->actingAsTestUser()->deleteJson('/api/group/delete/' . $group->id);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You don\'t have permission',
            ]);
    }
}
