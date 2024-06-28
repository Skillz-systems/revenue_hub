<?php

namespace Tests\Unit;

use Mockery;
use Tests\TestCase;
use App\Jobs\CsvExtractorJob;
use App\Models\CadastralZone;
use App\Models\Category;
use App\Models\Group;
use App\Models\PropertyType;
use App\Models\PropertyUse;
use App\Models\RatingDistrict;
use App\Models\Street;
use App\Service\RatingDistrictService;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CsvExtractorJobTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        Mockery::close();
    }

    public function test_handle_rating_district_can_be_created()
    {
        $data = ["for" => "rating_district", "data" => [["rating_district" => "District 1"]]];
        $job = new CsvExtractorJob($data);
        $job->handle();
        $this->assertDatabaseHas('rating_districts', ['name' => 'District 1']);
    }

    public function test_handle_rating_district_exists()
    {
        RatingDistrict::create(['name' => 'District 2']);
        $data = ["for" => "rating_district", "data" => [["rating_district" => "District 2"]]];
        $job = new CsvExtractorJob($data);
        $job->handle();
        $this->assertDatabaseCount('rating_districts',  1);
    }

    public function test_handle_cadastral_zone_can_be_created()
    {
        // create rating district 
        RatingDistrict::create(['name' => 'District 1']);
        $data = ["for" => "cadastral_zone", "data" => [["rating_district" => "District 1", "cadastral_zone" => "CZ 1"]]];
        $job = new CsvExtractorJob($data);
        $job->handle();

        $this->assertDatabaseHas('cadastral_zones', ['name' => 'CZ 1', 'rating_district_id' => 1]);
    }

    public function test_handle_cadastral_zone_Exists()
    {
        CadastralZone::factory(1)->create(['rating_district_id' => 1, 'name' => 'CZ 2']);
        $data = ["for" => "cadastral_zone", "data" => [["cadastral_zone" => "CZ 2", "rating_district" => 1]]];
        $job = new CsvExtractorJob($data);
        $job->handle();
        $this->assertDatabaseCount('cadastral_zones',  1);
    }

    public function test_handle_street_can_be_created()
    {
        // create rating district 
        $cadastralZone = CadastralZone::create(['name' => 'zone 1', 'rating_district_id' => 1]);
        $data = ["for" => "street", "data" => [["street" => "street 1", "cadastral_zone" => "zone 1"]]];
        $job = new CsvExtractorJob($data);
        $job->handle();

        $this->assertDatabaseHas('streets', ['name' => 'street 1', 'cadastral_zone_id' => $cadastralZone->id]);
    }

    public function test_handle_street_Exists()
    {
        Street::factory(1)->create(['cadastral_zone_id' => 1, 'name' => 'CZ 2']);
        $data = ["for" => "street", "data" => [["street" => "CZ 2", "cadastral_zone" => 1]]];
        $job = new CsvExtractorJob($data);
        $job->handle();
        $this->assertDatabaseCount('streets',  1);
    }

    public function test_handle_property_use_can_be_created()
    {
        $data = ["for" => "property_use", "data" => [["property_use" => "property use 1"]]];
        $job = new CsvExtractorJob($data);
        $job->handle();
        $this->assertDatabaseHas('property_uses', ['name' => 'property use 1']);
    }

    public function test_handle_property_use_exists()
    {
        PropertyUse::create(['name' => 'property use 2']);
        $data = ["for" => "property_use", "data" => [["property_use" => "property use 2"]]];
        $job = new CsvExtractorJob($data);
        $job->handle();
        $this->assertDatabaseCount('property_uses',  1);
    }

    public function test_handle_property_type_can_be_created()
    {
        $data = ["for" => "property_type", "data" => [["property_type" => "property type 1"]]];
        $job = new CsvExtractorJob($data);
        $job->handle();
        $this->assertDatabaseHas('property_types', ['name' => 'property type 1']);
    }

    public function test_handle_property_type_exists()
    {
        PropertyType::create(['name' => 'property type 2']);
        $data = ["for" => "property_type", "data" => [["property_type" => "property type 2"]]];
        $job = new CsvExtractorJob($data);
        $job->handle();
        $this->assertDatabaseCount('property_types',  1);
    }
    public function test_handle_category_can_be_created()
    {
        $data = ["for" => "category", "data" => [["category" => "category 1"]]];
        $job = new CsvExtractorJob($data);
        $job->handle();
        $this->assertDatabaseHas('categories', ['name' => 'category 1']);
    }

    public function test_handle_category_exists()
    {
        Category::create(['name' => 'category 2']);
        $data = ["for" => "category", "data" => [["category" => "category 2"]]];
        $job = new CsvExtractorJob($data);
        $job->handle();
        $this->assertDatabaseCount('categories',  1);
    }
    public function test_handle_group_can_be_created()
    {
        $data = ["for" => "group", "data" => [["group" => "group 1"]]];
        $job = new CsvExtractorJob($data);
        $job->handle();
        $this->assertDatabaseHas('groups', ['name' => 'group 1']);
    }

    public function test_handle_group_exists()
    {
        Group::create(['name' => 'group 2']);
        $data = ["for" => "group", "data" => [["group" => "group 2"]]];
        $job = new CsvExtractorJob($data);
        $job->handle();
        $this->assertDatabaseCount('groups',  1);
    }

    public function test_handle_property_creation()
    {
        // create rating district 
        RatingDistrict::create(['name' => 'District 1']);
        Group::create(['name' => 'group 1']);
        Category::create(['name' => 'category 1']);
        PropertyType::create(['name' => 'property type 1']);
        PropertyUse::create(['name' => 'property use 1']);
        Street::factory()->create(['cadastral_zone_id' => 1, 'name' => 'street 1']);
        CadastralZone::factory(1)->create(['rating_district_id' => 1, 'name' => 'cadastral zone 1']);
        $data = ["for" => "property", "data" => [
            '74544',
            'THE OCCUPIER',
            'BLOCK 9C  DRIVE 4  PRINCE & PRINCESS ESTATEATE',
            'street 1',
            'AM/B12/TR/2016/0041',
            'cadastral zone 1',
            'property type 1',
            'property use 1',
            'District 1',
            '1125000',
            '45000',
            '0',
            '0',
            '45000',
            'category 1',
            'group 1',
            "active",
        ]];
        $job = new CsvExtractorJob($data);
        $job->handle();

        $this->assertDatabaseHas('properties', ['pid' => '74544', 'rating_district_id' => "1"]);
    }
    public function test_handle_property_created_with_demand_notice()
    {
        // create rating district 
        RatingDistrict::create(['name' => 'District 1']);
        Group::create(['name' => 'group 1']);
        Category::create(['name' => 'category 1']);
        PropertyType::create(['name' => 'property type 1']);
        PropertyUse::create(['name' => 'property use 1']);
        Street::factory()->create(['cadastral_zone_id' => 1, 'name' => 'street 1']);
        CadastralZone::factory(1)->create(['rating_district_id' => 1, 'name' => 'cadastral zone 1']);
        $data = ["for" => "property", "data" => [
            '74544',
            'THE OCCUPIER',
            'BLOCK 9C  DRIVE 4  PRINCE & PRINCESS ESTATEATE',
            'street 1',
            'AM/B12/TR/2016/0041',
            'cadastral zone 1',
            'property type 1',
            'property use 1',
            'District 1',
            '1125000',
            '45,000',
            "200",
            '20',
            '45,000',
            'category 1',
            'group 1',
            "active",
        ]];
        $job = new CsvExtractorJob($data);
        $job->handle();

        $this->assertDatabaseHas('properties', ['pid' => '74544', 'rating_district_id' => "1"]);
        $this->assertDatabaseHas('demand_notices', ['property_id' => 1, 'amount' => "45000",]);
    }
}
