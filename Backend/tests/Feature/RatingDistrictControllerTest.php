<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\RatingDistrict;
use App\Service\RatingDistrictService;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RatingDistrictControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $ratingDistrictService;

    protected function setUp(): void
    {
        parent::setUp();

        // Mock the RatingDistrictService
        $this->ratingDistrictService = $this->createMock(RatingDistrictService::class);
        $this->app->instance(RatingDistrictService::class, $this->ratingDistrictService);
    }

    /** @test */
    public function it_returns_rating_districts_if_user_is_admin_or_md()
    {
        $this->ratingDistrictService->method('checkIsAdminOrMd')->willReturn(true);
        $ratingDistricts = RatingDistrict::factory()->count(3)->create();
        $this->ratingDistrictService->method('getAllRatingDistrict')->willReturn($ratingDistricts);

        $response = $this->actingAsTestUser()->getJson('/api/rating-district');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ])
            ->assertJsonStructure([
                'data' => [
                    '*' => 'office_zone_id', 
                ]
            ]);
    }

    /** @test */
    public function it_returns_error_if_no_rating_districts_found()
    {
        $this->ratingDistrictService->method('checkIsAdminOrMd')->willReturn(true);
        $this->ratingDistrictService->method('getAllRatingDistrict')->willReturn(null);

        $response = $this->actingAsTestUser()->getJson('/api/rating-district');

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'No rating district found',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md()
    {
        $this->ratingDistrictService->method('checkIsAdminOrMd')->willReturn(false);

        $response = $this->actingAsTestUser()->getJson('/api/rating-district');

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You don\'t Have Permission',
            ]);
    }

    /** @test */
    public function it_creates_a_rating_district_if_user_is_admin_or_md_and_data_is_valid()
    {
        $this->ratingDistrictService->method('checkIsAdminOrMd')->willReturn(true);

        $ratingDistrict = RatingDistrict::factory()->make([
            'id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $this->ratingDistrictService->method('create')->willReturn($ratingDistrict);

        $data = ['name' => 'Test RatingDistrict',
                'office_zone_id' => '1'];

        $response = $this->actingAsTestUser()->postJson('/api/rating-district/create', $data);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ])
            ->assertJsonStructure([
                'data' => 'office_zone_id', 
            ]);
    }

    /** @test */
    public function it_returns_error_if_rating_district_creation_validation_fails()
    {
        $this->ratingDistrictService->method('checkIsAdminOrMd')->willReturn(true);

        $data = ['name' => 'Updated RatingDistrict Name',
                'office_zone_id' => '1'];

        $response = $this->actingAsTestUser()->postJson('/api/rating-district/create', $data);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'All fields are required',
            ]);
    }

    /** @test */
    public function it_returns_error_if_rating_district_creation_fails()
    {
        $this->ratingDistrictService->method('checkIsAdminOrMd')->willReturn(true);
        $this->ratingDistrictService->method('create')->willReturn(null);

        $data = ['name' => 'Test RatingDistrict',
                'office_zone_id' => '1'];

        $response = $this->actingAsTestUser()->postJson('/api/rating-district/create', $data);

        $response->assertStatus(500)
            ->assertJson([
                'status' => 'error',
                'message' => 'An error occurred',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_rating_district_creation()
    {
        $this->ratingDistrictService->method('checkIsAdminOrMd')->willReturn(false);

        $data = ['name' => 'Test RatingDistrict',
                'office_zone_id' => '1'];

        $response = $this->actingAsTestUser()->postJson('/api/rating-district/create', $data);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You don\'t Have Permission',
            ]);
    }

    /** @test */
    public function it_returns_a_rating_district_if_user_is_admin_or_md_and_rating_district_exists()
    {
        $this->ratingDistrictService->method('checkIsAdminOrMd')->willReturn(true);

        $ratingDistrict = RatingDistrict::factory()->create();
        $this->ratingDistrictService->method('getRatingDistrictById')->willReturn($ratingDistrict);

        $response = $this->actingAsTestUser()->getJson('/api/rating-district/view/' . $ratingDistrict->id);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ])
            ->assertJsonStructure([
                'data' => ['id', 'name', 'office_zone_id', 'created_at', 'updated_at']
            ]);
    }

    /** @test */
    public function it_returns_error_if_rating_district_not_found()
    {
        $this->ratingDistrictService->method('checkIsAdminOrMd')->willReturn(true);
        $this->ratingDistrictService->method('getRatingDistrictById')->willReturn(null);

        $response = $this->actingAsTestUser()->getJson('/api/rating-district/view/999');

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'No rating district Found',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_view_rating_district()
    {
        $this->ratingDistrictService->method('checkIsAdminOrMd')->willReturn(false);

        $response = $this->actingAsTestUser()->getJson('/api/rating-district/view/1');

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You dont Have Permission',
            ]);
    }

    /** @test */
    public function it_updates_a_rating_district_if_user_is_admin_or_md_and_data_is_valid()
    {
        $this->ratingDistrictService->method('checkIsAdminOrMd')->willReturn(true);

        $ratingDistrict = RatingDistrict::factory()->create();
        $this->ratingDistrictService->method('updateRatingDistrict')->willReturn(true);

        $data = ['name' => 'Updated RatingDistrict Name',
                'office_zone_id' => '1'];

        $response = $this->actingAsTestUser()->putJson('/api/rating-district/update/' . $ratingDistrict->id, $data);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Rating District Updated successfully',
            ]);
    }

    /** @test */
    public function it_returns_error_if_validation_fails()
    {
        $this->ratingDistrictService->method('checkIsAdminOrMd')->willReturn(true);

        $data = ['name' => '',
                'office_zone_id' => '1'];

        $response = $this->actingAsTestUser()->putJson('/api/rating-district/update/1', $data);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'All fields are required',
            ]);
    }

    /** @test */
    public function it_returns_error_if_rating_district_update_fails()
    {
        $this->ratingDistrictService->method('checkIsAdminOrMd')->willReturn(true);
        $this->ratingDistrictService->method('updateRatingDistrict')->willReturn(false);

        $ratingDistrict = RatingDistrict::factory()->create();
        $data = ['name' => 'Updated RatingDistrict Name',
                'office_zone_id' => '1'];

        $response = $this->actingAsTestUser()->putJson('/api/rating-district/update/' . $ratingDistrict->id, $data);

        $response->assertStatus(500)
            ->assertJson([
                'status' => 'error',
                'message' => 'An error occurred',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_update_rating_district()
    {
        $this->ratingDistrictService->method('checkIsAdminOrMd')->willReturn(false);

        $ratingDistrict = RatingDistrict::factory()->create();
        $data = ['name' => 'Updated RatingDistrict Name',
                 'office_zone_id' => '1'
                ];

        $response = $this->actingAsTestUser()->putJson('/api/rating-district/update/' . $ratingDistrict->id, $data);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You dont Have Permission',
            ]);
    }

    /** @test */
    public function it_deletes_a_rating_district_if_user_is_admin_or_md()
    {
        $this->ratingDistrictService->method('checkIsAdminOrMd')->willReturn(true);
        $this->ratingDistrictService->method('deleteRatingDistrict')->willReturn(true);

        $ratingDistrict = RatingDistrict::factory()->create();

        $response = $this->actingAsTestUser()->deleteJson('/api/rating-district/delete/' . $ratingDistrict->id);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Rating District deleted successfully',
            ]);
    }

    /** @test */
    public function it_returns_error_if_rating_district_deletion_fails()
    {
        $this->ratingDistrictService->method('checkIsAdminOrMd')->willReturn(true);
        $this->ratingDistrictService->method('deleteRatingDistrict')->willReturn(false);

        $ratingDistrict = RatingDistrict::factory()->create();

        $response = $this->actingAsTestUser()->deleteJson('/api/rating-district/delete/' . $ratingDistrict->id);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'An error occurred',
            ]);
    }

    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_delete_rating_district()
    {
        $this->ratingDistrictService->method('checkIsAdminOrMd')->willReturn(false);

        $ratingDistrict = RatingDistrict::factory()->create();

        $response = $this->actingAsTestUser()->deleteJson('/api/rating-district/delete/' . $ratingDistrict->id);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You dont Have Permission',
            ]);
    }
}
