<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\RatingDistrict;
use App\Service\RatingDistrictService;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RatingDistrictServiceTest extends TestCase
{
    use RefreshDatabase;

    protected $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new RatingDistrictService();
    }

    public function test_new_rating_district_can_be_created()
    {
        $data = [
            'name' => 'District 1',
        ];

        $ratingDistrict = $this->service->create($data);

        $this->assertInstanceOf(RatingDistrict::class, $ratingDistrict);
        $this->assertDatabaseHas('rating_districts', [
            'name' => 'District 1',
        ]);
    }

    public function test_get__rating_district_from_district_name()
    {
        $data = [
            'name' => 'District 1',
        ];

        RatingDistrict::create($data);

        $ratingDistrict = $this->service->geRatingDistrictFromDistrictName('District 1');

        $this->assertInstanceOf(RatingDistrict::class, $ratingDistrict);
        $this->assertEquals('District 1', $ratingDistrict->name);
    }

    public function test_get_rating_district_from_district_name_when_not_found()
    {
        $ratingDistrict = $this->service->geRatingDistrictFromDistrictName('Nonexistent District');
        $this->assertNull($ratingDistrict);
    }
}
