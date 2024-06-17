<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\RatingDistrict;
use App\Service\RatingDistrictService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Auth;

class RatingDistrictControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $ratingDistrictService;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Mock RatingDistrictService
        $this->ratingDistrictService = $this->createMock(RatingDistrictService::class);
        $this->app->instance(RatingDistrictService::class, $this->ratingDistrictService);

        // Create a user and authenticate
        $this->user = User::factory()->create();
        $this->actingAs($this->user, 'api');
    }

    /** @test */
    public function it_can_get_all_rating_districts()
    {
        // Mock the service method
        $this->ratingDistrictService->method('checkIsAdminOrMd')
            ->willReturn(true);

        $ratingDistricts = RatingDistrict::factory()->count(3)->create();

        $this->ratingDistrictService->method('getAllRatingDistrict')
            ->willReturn($ratingDistricts);

        $response = $this->getJson('/api/rating-district');

        $response->assertStatus(200)
            ->assertJson(fn (AssertableJson $json) =>
                $json->has('data', 3)
                     ->has('status', 'success')
            );
    }

    /** @test */
    public function it_cannot_get_rating_districts_if_not_admin_or_md()
    {
        // Mock the service method
        $this->ratingDistrictService->method('checkIsAdminOrMd')
            ->willReturn(false);

        $response = $this->getJson('/api/rating-district');

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => "You don't Have Permission",
            ]);
    }

    /** @test */
    public function it_can_create_a_rating_district()
    {
        $data = [
            'name' => $this->faker->name,
            'office_zone_id' => (string)$this->faker->randomNumber(),
        ];

        $this->ratingDistrictService->method('checkIsAdminOrMd')
            ->willReturn(true);

        $this->ratingDistrictService->method('create')
            ->willReturn(new RatingDistrict($data));

        $response = $this->postJson('/api/rating-district/create', $data);

        $response->assertStatus(200)
            ->assertJson(fn (AssertableJson $json) =>
                $json->where('status', 'success')
                     ->has('data', fn ($json) =>
                        $json->where('name', $data['name'])
                             ->where('office_zone_id', $data['office_zone_id'])
                     )
            );
    }

    /** @test */
    public function it_cannot_create_rating_district_if_validation_fails()
    {
        $response = $this->postJson('/api/rating-district/create', []);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'All fields are required',
            ]);
    }

    /** @test */
    public function it_can_show_a_rating_district()
    {
        $ratingDistrict = RatingDistrict::factory()->create();

        $this->ratingDistrictService->method('checkIsAdminOrMd')
            ->willReturn(true);

        $this->ratingDistrictService->method('getRatingDistrictById')
            ->willReturn($ratingDistrict);

        $response = $this->getJson("/api/rating-district/view/{$ratingDistrict->id}");

        $response->assertStatus(200)
            ->assertJson(fn (AssertableJson $json) =>
                $json->where('status', 'success')
                     ->has('data', fn ($json) =>
                        $json->where('id', $ratingDistrict->id)
                             ->where('name', $ratingDistrict->name)
                             ->where('office_zone_id', $ratingDistrict->office_zone_id)
                     )
            );
    }

    /** @test */
    public function it_returns_404_if_rating_district_not_found()
    {
        $this->ratingDistrictService->method('checkIsAdminOrMd')
            ->willReturn(true);

        $this->ratingDistrictService->method('getRatingDistrictById')
            ->willReturn(null);

        $response = $this->getJson('/api/rating-district/view/9999');

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'No rating district Found',
            ]);
    }
}
