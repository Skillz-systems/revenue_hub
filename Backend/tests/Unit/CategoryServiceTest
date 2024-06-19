<?php

namespace Tests\Unit;

use App\Service\CategoryService;
use Tests\TestCase;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;

class CategoryServiceTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $categoryService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->categoryService = new CategoryService();
    }

    /** @test */
    public function it_can_retrieve_all_categories()
    {
        // Create some categories
        Category::factory()->count(3)->create();

        $categories = $this->categoryService->getAllCategory();

        $this->assertCount(3, $categories);
    }

    /** @test */
    public function it_can_create_a_new_category()
    {
        $data = [
            'name' => $this->faker->word,
        ];

        $category = $this->categoryService->create($data);

        $this->assertDatabaseHas('categories', ['id' => $category->id, 'name' => $data['name']]);
    }

    /** @test */
    public function it_can_retrieve_a_category_by_name()
    {
        $category = Category::factory()->create();

        $foundCategory = $this->categoryService->getCategoryFromCategoryName($category->name);

        $this->assertEquals($category->id, $foundCategory->id);
    }

    /** @test */
    public function it_can_retrieve_a_category_by_id()
    {
        $category = Category::factory()->create();

        $foundCategory = $this->categoryService->getCategoryById($category->id);

        $this->assertEquals($category->id, $foundCategory->id);
    }

    /** @test */
    public function it_can_update_a_category()
    {
        $category = Category::factory()->create();
        $data = [
            'name' => $this->faker->word,
        ];

        $result = $this->categoryService->updateCategory($data, $category->id);

        $this->assertTrue($result);
        $this->assertDatabaseHas('categories', ['id' => $category->id, 'name' => $data['name']]);
    }

    /** @test */
    public function it_can_delete_a_category()
    {
        $category = Category::factory()->create();

        $result = $this->categoryService->deleteCategory($category->id);

        $this->assertTrue($result);
        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }
}
