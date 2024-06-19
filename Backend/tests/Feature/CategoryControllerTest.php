<?php

namespace Tests\Feature;

use Mockery;
use Tests\TestCase;
use App\Models\Category;
use App\Service\CategoryService;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CategoryControllerTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    use RefreshDatabase;

    protected $category;

    protected function setUp(): void
    {
        parent::setUp();

        // Mock the CategoryService
        $this->category = $this->createMock(CategoryService::class);
        $this->app->instance(CategoryService::class, $this->category);
    }

    /** @test */
    public function it_returns_category_if_user_is_admin_or_md()
    {
        // Assume the user is an admin or MD
        $this->category->method('checkIsAdminOrMd')->willReturn(true);

        // Assume the category service returns some category
        $category = Category::factory()->count(3)->make();
        $this->category->method('getAllCategory')->willReturn($category);

        $response = $this->actingAsTestUser()
            ->getJson('/api/category');

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
    public function it_returns_error_if_no_category_found()
    {
        // Assume the user is an admin or MD
        $this->category->method('checkIsAdminOrMd')->willReturn(true);

        // Assume the category service returns no category
        $this->category->method('getAllCategory')->willReturn(null);

        $response = $this->actingAsTestUser()
            ->getJson('/api/category');

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'No Category found',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md()
    {
        // Assume the user is not an admin or MD
        $this->category->method('checkIsAdminOrMd')->willReturn(false);

        $response = $this->actingAsTestUser()
            ->getJson('/api/category');

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You dont Have Permission',
            ]);
    }

    /** @test */
    public function it_creates_a_category_if_user_is_admin_or_md_and_data_is_valid()
    {
        // Assume the user is an admin or MD
        $this->category->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the creation process
        $createCategory = Category::factory()->make();
        $this->category->method('create')->willReturn($createCategory);

        $data = [
            'name' => 'Test Category',
        ];

        $response = $this->actingAsTestUser()
            ->postJson('/api/category/create', $data);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ])
            ->assertJsonStructure([
                'data' => ['id', 'name', 'created_at', 'updated_at']
            ]);
    }

    /** @test */
    public function it_returns_error_if_category_creation_validation_fails()
    {
        // Assume the user is an admin or MD
        $this->category->method('checkIsAdminOrMd')->willReturn(true);

        $data = [
            'name' => '',  // Invalid data
        ];

        $response = $this->actingAsTestUser()
            ->postJson('/api/category/create', $data);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'All fields are required',
            ])
            ->assertJsonStructure(['data']);
    }

    /** @test */
    public function it_returns_error_if_category_creation_fails()
    {
        // Assume the user is an admin or MD
        $this->category->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the creation process to fail
        $this->category->method('create')->willReturn(null);

        $data = [
            'name' => 'Test Category',
        ];

        $response = $this->actingAsTestUser()
            ->postJson('/api/category/create', $data);

        $response->assertStatus(500)
            ->assertJson([
                'status' => 'error',
                'message' => 'An error occured',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_category_creation()
    {
        // Assume the user is not an admin or MD
        $this->category->method('checkIsAdminOrMd')->willReturn(false);

        $data = [
            'name' => 'Test Category',
        ];

        $response = $this->actingAsTestUser()
            ->postJson('/api/category/create', $data);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You dont Have Permission',
            ]);
    }

    /** @test */
    public function it_returns_a_category_if_user_is_admin_or_md_and_category_exists()
    {
        // Assume the user is an admin or MD
        $this->category->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the category
        $createCategory = Category::factory()->make();
        $this->category->method('getCategoryById')->willReturn($createCategory);

        $response = $this->actingAsTestUser()
            ->getJson('/api/category/view/1');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ])
            ->assertJsonStructure([
                'data' => ['id', 'name', 'created_at', 'updated_at']
            ]);
    }

    /** @test */
    public function it_returns_error_if_category_not_found()
    {
        // Assume the user is an admin or MD
        $this->category->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the category not found
        $this->category->method('getCategoryById')->willReturn(null);

        $response = $this->actingAsTestUser()
            ->getJson('/api/category/view/999');

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'No Category Found',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_view_category()
    {
        // Assume the user is not an admin or MD
        $this->category->method('checkIsAdminOrMd')->willReturn(false);

        $response = $this->actingAsTestUser()
            ->getJson('/api/category/view/1');

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You dont Have Permission',
            ]);
    }

    /** @test */
    public function it_updates_a_category_if_user_is_admin_or_md_and_data_is_valid()
    {
        // Assume the user is an admin or MD
        $this->category->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the update process
        $createCategory = Category::factory()->create([
            'name' => "New Category",
        ]);
        $this->category->method('updateCategory')->willReturn(true);

        $data = [
            'name' => 'Updated Category Name',
        ];

        $response = $this->actingAsTestUser()
            ->putJson('/api/category/update/' . $createCategory->id, $data);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Category Updated successfully',
            ]);
    }

    /** @test */
    public function it_returns_error_if_validation_fails()
    {
        // Assume the user is an admin or MD
        $this->category->method('checkIsAdminOrMd')->willReturn(true);

        $data = [
            'name' => '',  // Invalid data
        ];

        $response = $this->actingAsTestUser()
            ->putJson('/api/category/update/1', $data);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'All fields are required',
            ])
            ->assertJsonStructure(['data']);
    }

    /** @test */
    public function it_returns_error_if_category_update_fails()
    {
        // Assume the user is an admin or MD
        $this->category->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the update process to fail
        $this->category->method('updateCategory')->willReturn(false);

        $createCategory = Category::factory()->create([
            'name' => "New Category",
        ]);

        $data = [
            'name' => 'Updated Category Name',
        ];

        $response = $this->actingAsTestUser()
            ->putJson('/api/category/update/' . $createCategory->id, $data);

        $response->assertStatus(500)
            ->assertJson([
                'status' => 'error',
                'message' => 'An error occured',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_update_category()
    {
        // Assume the user is not an admin or MD
        $this->category->method('checkIsAdminOrMd')->willReturn(false);

        $createCategory = Category::factory()->create([
            'name' => "New Category",
        ]);
        $data = [
            'name' => 'Updated Category Name',
        ];

        $response = $this->actingAsTestUser()
            ->putJson('/api/category/update/' . $createCategory->id, $data);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You dont Have Permission',
            ]);
    }

    /** @test */
    public function it_deletes_a_category_if_user_is_admin_or_md()
    {
        // Assume the user is an admin or MD
        $this->category->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the delete process
        $this->category->method('deleteCategory')->willReturn(true);

        $createCategory = Category::factory()->create([
            'name' => "New Category",
        ]);

        $response = $this->actingAsTestUser()
            ->deleteJson('/api/category/delete/' . $createCategory->id);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Category deleted successfully',
            ]);
    }

    /** @test */
    public function it_returns_error_if_category_deletion_fails()
    {
        // Assume the user is an admin or MD
        $this->category->method('checkIsAdminOrMd')->willReturn(true);

        // Mock the delete process to fail
        $this->category->method('deleteCategory')->willReturn(false);

        $createCategory = Category::factory()->create([
            'name' => "New Category",
        ]);

        $response = $this->actingAsTestUser()
            ->deleteJson('/api/category/delete/' . $createCategory->id);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'An error occured',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_delete_category()
    {
        // Assume the user is not an admin or MD
        $this->category->method('checkIsAdminOrMd')->willReturn(false);

        $createCategory = Category::factory()->create([
            'name' => "New Category",
        ]);

        $response = $this->actingAsTestUser()
            ->deleteJson('/api/category/delete/' . $createCategory->id);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You dont Have Permission',
            ]);
    }
}
