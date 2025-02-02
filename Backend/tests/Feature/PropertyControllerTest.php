<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Group;
use App\Models\Street;
use App\Models\Category;
use App\Models\Property;
use App\Models\OfficeZone;
use App\Models\PropertyUse;
use App\Models\DemandNotice;
use App\Models\PropertyType;
use App\Jobs\CsvExtractorJob;
use App\Models\CadastralZone;
use App\Models\RatingDistrict;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Queue;
use App\Jobs\ProcessCSVFileInBatchJob;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PropertyControllerTest extends TestCase
{
    use RefreshDatabase;

    // public function test_it_returns_properties_successfully()
    // {
    //     // Arrange: Create some properties
    //     DemandNotice::factory()->create(["property_id" => 1]);

    //     DemandNotice::factory()->create(["property_id" => 3, "status" => 1]);
    //     OfficeZone::factory()->create();
    //     RatingDistrict::factory()->create();
    //     CadastralZone::factory()->create();
    //     Street::factory()->create();
    //     PropertyType::factory()->create();
    //     PropertyUse::factory()->create();
    //     Category::factory()->create();
    //     Group::factory()->create();
    //     Property::factory()->count(3)->create();

    //     // Act: Call the index route
    //     $response = $this->actingAsTestUser()->getJson('/api/property');

    //     // Assert: Check the response
    //     $response->assertStatus(200)
    //         ->assertJson([
    //             'status' => 'success',
    //         ])
    //         ->assertJsonStructure([
    //             'data' => [
    //                 '*' => [
    //                     'id',
    //                     'pid',
    //                 ],
    //             ],
    //         ]);
    // }

    // public function test_it_returns_no_properties_found_when_no_properties_exist()
    // {
    //     // Act: Call the index route
    //     $response = $this->actingAsTestUser()->getJson('/api/property');

    //     // Assert: Check the response
    //     $response->assertStatus(200)
    //         ->assertJson([
    //             'status' => 'success',
    //             'data' => [],
    //         ]);
    // }

    // public function test_it_stores_a_new_property_successfully()
    // {

    //     OfficeZone::factory()->create();
    //     RatingDistrict::factory()->create();
    //     CadastralZone::factory()->create();
    //     Street::factory()->create();
    //     PropertyType::factory()->create();
    //     PropertyUse::factory()->create();
    //     Category::factory()->create();
    //     Group::factory()->create();
    //     // Arrange: Prepare valid property data
    //     $data = [
    //         'pid' => "1",
    //         'occupant' => 'John Doe',
    //         'prop_addr' => '123 Main St',
    //         'street_name' => '1',
    //         'asset_no' => 'A-001',
    //         'cadastral_zone' => '1',
    //         'prop_type' => '1',
    //         'prop_use' => '1',
    //         'rating_dist' => '1',
    //         'annual_value' => "10000",
    //         'rate_payable' => "1000",
    //         'grand_total' => "11000",
    //         'category' => '1',
    //         'group' => '1',
    //         'active' => 'Yes',
    //     ];

    //     // Act: Call the store route with valid data
    //     $response = $this->actingAsTestUser()->postJson('/api/property', $data);

    //     // Assert: Check the response and database
    //     $response->assertStatus(201)
    //         ->assertJson([
    //             'status' => 'success',
    //             'context' => 'store',
    //         ]);

    //     $this->assertDatabaseHas('properties', ['pid' => 1, 'occupant' => 'John Doe']);
    // }

    // public function test_it_returns_validation_error_when_required_fields_are_missing()
    // {
    //     // Act: Call the store route with incomplete data
    //     $response = $this->actingAsTestUser()->postJson('/api/property', []);

    //     // Assert: Check the response for validation errors
    //     $response->assertStatus(400)
    //         ->assertJson([
    //             'status' => 'error',
    //             'message' => 'All fields are required ',
    //         ]);
    // }

    // public function test_it_returns_error_when_pid_is_not_unique()
    // {
    //     // Arrange: Create a property with a specific pid
    //     Property::factory()->create(['pid' => 1]);

    //     // Act: Attempt to create another property with the same pid
    //     $data = [
    //         'pid' => 1,
    //         'occupant' => 'Jane Doe',
    //         'prop_addr' => '456 Elm St',
    //         'street_name' => 'Elm St',
    //         'asset_no' => 'A-002',
    //         'cadastral_zone' => 'Zone 2',
    //         'prop_type' => 'Commercial',
    //         'prop_use' => 'Commercial',
    //         'rating_dist' => 'District 2',
    //         'annual_value' => 20000,
    //         'rate_payable' => 2000,
    //         'grand_total' => 22000,
    //         'category' => 'Category 2',
    //         'group' => 'Group 2',
    //         'active' => 'Yes',
    //     ];

    //     // Act: Call the store route with duplicate pid
    //     $response = $this->actingAsTestUser()->postJson('/api/property', $data);

    //     // Assert: Check the response for unique constraint violation
    //     $response->assertStatus(400)
    //         ->assertJson([
    //             'status' => 'error',
    //             'message' => 'All fields are required ',
    //         ]);

    //     $this->assertDatabaseMissing('properties', ['occupant' => 'Jane Doe']);
    // }

    // public function test_it_shows_a_property_successfully()
    // {
    //     OfficeZone::factory()->create();
    //     RatingDistrict::factory()->create();
    //     CadastralZone::factory()->create();
    //     Street::factory()->create();
    //     PropertyType::factory()->create();
    //     PropertyUse::factory()->create();
    //     Category::factory()->create();
    //     Group::factory()->create();
    //     // Arrange: Create a property
    //     $property = Property::factory()->create();

    //     // Act: Call the show route with the created property's ID
    //     $response = $this->actingAsTestUser()->getJson("/api/property/{$property->id}");

    //     // Assert: Check the response
    //     $response->assertStatus(200)
    //         ->assertJson([
    //             'status' => 'success',
    //             'data' => [
    //                 'id' => $property->id,
    //                 // Add other fields you want to check
    //             ],
    //         ]);
    // }

    /** @test */
    // public function test_it_returns_error_if_property_not_found()
    // {
    //     // Act: Call the show route with a non-existent property ID
    //     $response = $this->actingAsTestUser()->getJson('/api/property/999');

    //     // Assert: Check the response for error
    //     $response->assertStatus(404)
    //         ->assertJson([
    //             'status' => 'error',
    //             'message' => 'No Property Found',
    //         ]);
    // }

    // public function test_testSuccessfulUpdate()
    // {
    //     OfficeZone::factory()->create();
    //     RatingDistrict::factory()->create();
    //     CadastralZone::factory()->create();
    //     Street::factory()->create();
    //     PropertyType::factory()->create();
    //     PropertyUse::factory()->create();
    //     Category::factory()->create();
    //     Group::factory()->create();
    //     $property = Property::factory()->create();
    //     // Assuming $property is a property instance
    //     $data = [
    //         'occupant' => 'John Doe',
    //         'prop_addr' => '123 Main St',
    //         'street_name' => '1',
    //         'asset_no' => 'A-001',
    //         'cadastral_zone' => '1',
    //         'prop_type' => '1',
    //         'prop_use' => '1',
    //         'rating_dist' => '1',
    //         'annual_value' => "10000",
    //         'rate_payable' => "1000",
    //         'grand_total' => "11000",
    //         'category' => '1',
    //         'group' => '1',
    //         'active' => 'Yes',
    //     ];

    //     $response = $this->actingAsTestUser()->putJson("api/property/" . $property->id, $data);

    //     $response->assertStatus(200)
    //         ->assertJson([
    //             'status' => 'success',
    //             'message' => 'Updated property successfully',
    //         ]);
    // }

    // public function test_testFailedUpdateWithInvalidData()
    // {
    //     $property = Property::factory()->create();
    //     // Assuming $property is a property instance
    //     $data = [
    //         'occupant' => 'John Doe',
    //         'prop_addr' => '123 Main St',
    //         'street_name' => 'Main St',
    //         'asset_no' => 'A-001',
    //         'cadastral_zone' => 'Zone 1',
    //         'prop_type' => 'Residential',
    //         'prop_use' => 'Residential',
    //         'rating_dist' => 'District 1',
    //         'annual_value' => 10000,

    //     ];

    //     $response = $this->actingAsTestUser()->putJson("api/property/" . $property->id, $data);

    //     $response->assertStatus(400)
    //         ->assertJsonStructure([
    //             'status',
    //             'message',
    //             'data' => [
    //                 // Assert error messages for each field
    //             ],
    //         ]);
    // }

    // public function testFailedUpdateWithError()
    // {
    //     $property = Property::factory()->create();
    //     // Assuming $property is a property instance
    //     $data = [];

    //     // Mock the PropertyService to simulate an error during update
    //     $this->mock(PropertyService::class, function ($mock) {
    //         $mock->shouldReceive('updateProperty')->andReturn(false);
    //     });

    //     $response = $this->actingAsTestUser()->putJson("api/property/" . $property->id, $data);

    //     $response->assertStatus(401)
    //         ->assertJson([
    //             'status' => 'error',
    //             'message' => 'An error occurred'
    //         ]);
    // }

    // public function test_admin_can_delete_a_property()
    // {
    //     $admin = User::factory()->create(['role_id' => User::ROLE_ADMIN]);
    //     $staff = User::factory()->create();

    //     $this->actingAs($admin);
    //     $property = Property::factory()->create();
    //     $response = $this->deleteJson("/api/property/{$property->id}");

    //     $response->assertStatus(200)
    //         ->assertJson([
    //             'status' => 'success',
    //             'message' => 'Property deleted successfully',
    //         ]);

    //     $this->assertDatabaseMissing('properties', ['id' => $property->id]);
    // }

    // public function test_non_admin_cannot_delete_a_property()
    // {
    //     $user = User::factory()->create(['role_id' => User::ROLE_ENFORCERS]);
    //     $staff = User::factory()->create();

    //     $this->actingAs($user);
    //     $property = Property::factory()->create();
    //     $response = $this->deleteJson("/api/property/{$property->id}");

    //     $response->assertStatus(401)
    //         ->assertJson([
    //             'status' => 'error',
    //             'message' => 'You dont Have Permission',
    //         ]);

    //     $this->assertDatabaseHas('properties', ['id' => $property->id]);
    // }

    // public function test_to_see_if_csv_file_can_be_extracted_and_updated_on_the_database(): void
    // {
    //     //Storage::fake('local');
    //     Queue::fake();
    //     // Create a fake CSV file
    //     $csvContent = "header0,header1,header2,header3,header4,header5,header6,header7,header8,header9,header10,header11,header12,header13,header14,header15,header16\nvalue0,value1,value2,value3,value4,value5,value6,value7,value8,value9,value10,value11,value12,value13,value14,value15,header11";
    //     $file = UploadedFile::fake()->createWithContent('test.csv', $csvContent);

    //     // Perform the request
    //     $response = $this->post('/api/property/process-csv', [
    //         'file' => $file,
    //         'chunk_number' => 1,
    //         'total_chunks' => 1,
    //         'file_name' => "test.csv",
    //     ]);

    //     Queue::assertPushed(ProcessCSVFileInBatchJob::class, 1);

    //     // Assert the response status
    //     $response->assertStatus(200);
    //     $response->assertJson(['message' => 'File uploaded successfully and merged']);
    // }
}
