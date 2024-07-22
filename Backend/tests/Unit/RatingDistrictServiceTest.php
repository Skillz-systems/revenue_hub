<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\RatingDistrict;
use App\Models\User;
use App\Service\RatingDistrictService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;

class RatingDistrictServiceTest extends TestCase
{
    use RefreshDatabase;

    protected $ratingDistrictService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->ratingDistrictService = new RatingDistrictService();
    }

    /** @test */
    public function it_can_get_all_rating_districts()
    {
        $ratingDistricts = RatingDistrict::factory()->count(3)->create();

        $result = $this->ratingDistrictService->getAllRatingDistrict();

        $this->assertCount(3, $result);
    }

    /** @test */
    public function it_can_create_a_rating_district()
    {
        $data = [
            'name' => 'Test District',
            'office_zone_id' => '1',
        ];

        $ratingDistrict = $this->ratingDistrictService->create($data);

        $this->assertDatabaseHas('rating_districts', $data);
    }

    /** @test */
    public function it_can_get_a_rating_district_by_id()
    {
        $ratingDistrict = RatingDistrict::factory()->create();

        $result = $this->ratingDistrictService->getRatingDistrictById($ratingDistrict->id);

        $this->assertNotNull($result);
        $this->assertEquals($ratingDistrict->id, $result->id);
    }

    /** @test */
    public function it_returns_null_if_rating_district_not_found_by_id()
    {
        $result = $this->ratingDistrictService->getRatingDistrictById(999);

        $this->assertNull($result);
    }

    /** @test */
    public function it_can_update_a_rating_district()
    {
        $ratingDistrict = RatingDistrict::factory()->create();
        $data = ['name' => 'Updated District'];

        $result = $this->ratingDistrictService->updateRatingDistrict($data, $ratingDistrict->id);

        $this->assertTrue($result);
        $this->assertDatabaseHas('rating_districts', ['id' => $ratingDistrict->id, 'name' => 'Updated District']);
    }

    /** @test */
    public function it_throws_exception_if_rating_district_not_found_for_update()
    {
        $this->expectException(\Exception::class);

        $this->ratingDistrictService->updateRatingDistrict(['name' => 'Updated District'], 999);
    }

    /** @test */
    public function it_can_delete_a_rating_district()
    {
        $ratingDistrict = RatingDistrict::factory()->create();

        $result = $this->ratingDistrictService->deleteRatingDistrict($ratingDistrict->id);

        $this->assertTrue($result);
        $this->assertDatabaseMissing('rating_districts', ['id' => $ratingDistrict->id]);
    }

    /** @test */
    public function it_throws_exception_if_rating_district_not_found_for_delete()
    {
        $this->expectException(\Exception::class);

        $this->ratingDistrictService->deleteRatingDistrict(999);
    }
}
