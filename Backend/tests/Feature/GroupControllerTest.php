<?php

namespace Tests\Feature;

use App\Models\Group;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class GroupControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $md;
    protected $user;
    protected $group;

    protected function setUp(): void
    {
        parent::setUp();

        // Create a test user
        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->md = User::factory()->create(['role' => 'md']);
        $this->user = User::factory()->create(['role' => 'user']);

        // Create a test group
        $this->group = Group::factory()->create();
    }

    /** @test */
    public function admin_can_get_group_list()
    {
        $response = $this->actingAs($this->admin)->getJson('/api/group');

        $response->assertStatus(200)
                 ->assertJsonStructure(['status', 'data']);
    }

    /** @test */
    public function non_admin_cannot_get_group_list()
    {
        $response = $this->actingAs($this->user)->getJson('/api/group');

        $response->assertStatus(403)
                 ->assertJson([
                     'status' => 'error',
                     'message' => "You don't have permission",
                 ]);
    }

    /** @test */
    public function admin_can_create_group()
    {
        $response = $this->actingAs($this->admin)->postJson('/api/group/create', [
            'name' => 'New Group'
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'status' => 'success',
                     'message' => 'Group created successfully',
                 ]);

        $this->assertDatabaseHas('groups', ['name' => 'New Group']);
    }

    /** @test */
    public function create_group_validation()
    {
        $response = $this->actingAs($this->admin)->postJson('/api/group/create', []);

        $response->assertStatus(400)
                 ->assertJson([
                     'status' => 'error',
                     'message' => 'All fields are required',
                 ]);
    }

    /** @test */
    public function admin_can_view_group()
    {
        $response = $this->actingAs($this->admin)->getJson('/api/group/view/'.$this->group->id);

        $response->assertStatus(200)
                 ->assertJsonStructure(['status', 'data']);
    }

    /** @test */
    public function non_admin_cannot_view_group()
    {
        $response = $this->actingAs($this->user)->getJson('/api/group/view/'.$this->group->id);

        $response->assertStatus(403)
                 ->assertJson([
                     'status' => 'error',
                     'message' => "You don't have permission",
                 ]);
    }

    /** @test */
    public function admin_can_update_group()
    {
        $response = $this->actingAs($this->admin)->putJson('/api/group/update/'.$this->group->id, [
            'name' => 'Updated Group'
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'status' => 'success',
                     'message' => 'Group updated successfully',
                 ]);

        $this->assertDatabaseHas('groups', ['name' => 'Updated Group']);
    }

    /** @test */
    public function update_group_validation()
    {
        $response = $this->actingAs($this->admin)->putJson('/api/group/update/'.$this->group->id, []);

        $response->assertStatus(400)
                 ->assertJson([
                     'status' => 'error',
                     'message' => 'All fields are required',
                 ]);
    }

    /** @test */
    public function admin_can_delete_group()
    {
        $response = $this->actingAs($this->admin)->deleteJson('/api/group/delete/'.$this->group->id);

        $response->assertStatus(200)
                 ->assertJson([
                     'status' => 'success',
                     'message' => 'Group deleted successfully',
                 ]);

        $this->assertDatabaseMissing('groups', ['id' => $this->group->id]);
    }

    /** @test */
    public function non_admin_cannot_delete_group()
    {
        $response = $this->actingAs($this->user)->deleteJson('/api/group/delete/'.$this->group->id);

        $response->assertStatus(403)
                 ->assertJson([
                     'status' => 'error',
                     'message' => "You don't have permission",
                 ]);
    }
}
