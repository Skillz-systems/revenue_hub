<?php

namespace Tests\Feature;

use Mockery;
use Tests\TestCase;
use App\Models\Street;
use App\Models\CadastralZone;
use App\Service\CadastralZoneService;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CadastralZoneControllerTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    use RefreshDatabase;

    /** @test */
    public function it_returns_cadastral_zone_if_user_is_admin_or_md()
    {

        CadastralZone::factory()->count(3)->create();

        $response = $this->actingAsTestUser()
            ->getJson('/api/cadastral-zone');

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
    public function it_returns_error_if_no_cadastralZone_found()
    {

        $service = Mockery::mock(CadastralZoneService::class);

        $service->shouldReceive('checkIsAdminOrMd')->once()->andReturn(true);

        $service->shouldReceive('getAllCadastralZone')->once()->andReturn(false);
        $this->app->instance(CadastralZoneService::class, $service);

        $response = $this->actingAsTestUser()
            ->getJson('/api/cadastral-zone');

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'No Cadastral Zone found',
            ]);
    }


    /** @test */
    public function it_creates_a_cadastral_zone_if_user_is_admin_or_md_and_data_is_valid()
    {

        $data = [
            'name' => 'Test Street',
            'rating_district_id' => 1,
        ];

        $response = $this->actingAsTestUser()
            ->postJson('/api/cadastral-zone/create', $data);
        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ]);
    }

    /** @test */
    public function it_returns_error_if_cadastral_zone_creation_validation_fails()
    {

        $data = [
            'name' => '',   //Invalid data
            'rating_district_id' => '',
        ];

        $response = $this->actingAsTestUser()
            ->postJson('/api/cadastral-zone/create', $data);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'All fields are required',
            ])
            ->assertJsonStructure(['data']);
    }

    /** @test */
    public function it_returns_error_if_cadastral_zone_creation_fails()
    {

        $service = Mockery::mock(CadastralZoneService::class);

        $service->shouldReceive('checkIsAdminOrMd')->once()->andReturn(true);

        $service->shouldReceive('create')->once()->andReturn(false);
        $this->app->instance(CadastralZoneService::class, $service);

        $data = [
            'name' => 'Test Street',
            'rating_district_id' => 1,
        ];

        $response = $this->actingAsTestUser()
            ->postJson('/api/cadastral-zone/create', $data);

        $response->assertStatus(500)
            ->assertJson([
                'status' => 'error',
                'message' => 'An error occured',
            ]);
    }


    /** @test */
    public function it_returns_a_cadastral_zone_if_cadastral_zone_found()
    {
        // Mock the street
        $cadastralZone = CadastralZone::factory()->create();

        $response = $this->actingAsTestUser()
            ->getJson('/api/cadastral-zone/view/' . $cadastralZone->id);
        //dd($response);
        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ])
            ->assertJsonStructure([
                'data' => ['id', 'name', 'rating_district', 'created_at', 'updated_at']
            ]);
    }

    /** @test */
    public function it_returns_error_if_cadastral_zone_not_found()
    {

        $response = $this->actingAsTestUser()
            ->getJson('/api/cadastral-zone/view/999');

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'No Cadastral Zone Found',
            ]);
    }


    /** @test */
    public function it_updates_a_cadastral_zone_if_user_is_admin_or_md_and_data_is_valid()
    {

        //Mock the update process
        $createCadastralZone = CadastralZone::factory()->create([
            'name' => "New Nme",
            'rating_district_id' => '2',
        ]);

        $data = [
            'name' => 'Updated Cadastral Zone Name',
            'rating_district_id' => 'Updated Rating Id',
        ];

        $response = $this->actingAsTestUser()
            ->putJson('/api/cadastral-zone/update/' . $createCadastralZone->id, $data);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Cadastral Zone Updated successfully',
            ]);
    }

    /** @test */
    public function it_returns_error_if_validation_fails()
    {
        $data = [
            'name' => '',   //Invalid data
            'rating_district_id' => '',
        ];

        $response = $this->actingAsTestUser()
            ->putJson('/api/cadastral-zone/update/1', $data);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'All fields are required',
            ])
            ->assertJsonStructure(['data']);
    }



    /** @test */
    public function it_deletes_a_cadastral_zone_if_user_is_admin_or_md()
    {
        $service = Mockery::mock(CadastralZoneService::class);

        $service->shouldReceive('checkIsAdminOrMd')->once()->andReturn(true);

        $service->shouldReceive('deleteCadastralZone')->once()->andReturn(true);
        $this->app->instance(CadastralZoneService::class, $service);

        $createCadastralZone = CadastralZone::factory()->create([
            'name' => "New Nme",
            'rating_district_id' => '2',
        ]);

        $response = $this->actingAsTestUser()
            ->deleteJson('/api/cadastral-zone/delete/' . $createCadastralZone->id);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Cadastral Zone deleted successfully',
            ]);
    }



    /** @test */
    public function it_returns_error_if_user_is_not_admin_or_md_for_delete_cadastral_zone()
    {
        $service = Mockery::mock(CadastralZoneService::class);

        $service->shouldReceive('checkIsAdminOrMd')->once()->andReturn(false);

        $this->app->instance(CadastralZoneService::class, $service);

        $createCadastralZone = CadastralZone::factory()->create([
            'name' => "New Nme",
            'rating_district_id' => '2',
        ]);



        $response = $this->actingAsTestUser()
            ->deleteJson('/api/cadastral-zone/delete/' . $createCadastralZone->id);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'You dont Have Permission',
            ]);
    }
}
