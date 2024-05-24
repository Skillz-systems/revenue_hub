<?php

namespace Tests\Unit;

use App\Models\DemandNotice;
use App\Models\Payment;
use App\Models\Property;
use App\Service\DemandNoticeService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Faker\Factory as Faker;
use Flutterwave\Service\VirtualAccount;
use Illuminate\Support\Facades\Http;
use Mockery;
use Mockery\MockInterface;

class DemandNoticeTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic test example.
     */

    private  $faker;


    protected function setUp(): void
    {
        parent::setUp();

        // Setup the fake response
        $this->faker = Faker::create();
    }
    public function test_to_see_if_all_demand_notice_can_be_fetched(): void
    {
        DemandNotice::factory()->create();
        $getAllDemandNotice = (new DemandNoticeService())->allDemandNotice();
        $this->assertEquals(1, count($getAllDemandNotice));
    }

    public function test_to_see_if_a_new_demand_notice_can_be_created()
    {
        $property = Property::factory()->create();
        $createNewDemandNotice = (new DemandNoticeService())->createDemandNotice($property->id);
        $demandNoticeArray = $createNewDemandNotice->toArray();
        $demandNoticeArray['created_at'] = Carbon::parse($demandNoticeArray['created_at'])->format('Y-m-d H:i:s');
        $demandNoticeArray['updated_at'] = Carbon::parse($demandNoticeArray['updated_at'])->format('Y-m-d H:i:s');

        // Assert the demand notice was created in the database
        $this->assertDatabaseHas('demand_notices', $demandNoticeArray);
    }
    public function test_to_see_if_a_single_demand_notice_can_be_fetched()
    {
        $property = Property::factory()->create();
        $demandNotice = DemandNotice::factory()->create(["property_id" => $property->id]);
        $getDemandNotice = (new DemandNoticeService())->viewDemandNotice($demandNotice->id);
        $this->assertEquals($getDemandNotice->property_id, $property->id);
    }

    public function test_to_see_if_a_single_demand_notice_can_be_updated()
    {
        $data = [
            "amount" => $this->faker->numberBetween(1000, 1000000),
        ];
        $property = Property::factory()->create();
        $demandNotice = DemandNotice::factory()->create(["property_id" => $property->id]);
        $updateDemandNotice = (new DemandNoticeService())->updateDemandNotice($demandNotice->id, $data);
        $this->assertEquals($updateDemandNotice, true);
        $getUpdatedDemandNotice = (new DemandNoticeService())->viewDemandNotice($demandNotice->id);
        $this->assertNotEquals($getUpdatedDemandNotice->amount, $demandNotice->amount);
    }

    public function test_to_see_if_a_single_payment_can_be_deleted()
    {
        $demandNotice = DemandNotice::factory()->create();
        $deleteDemandNotice = (new DemandNoticeService())->deleteDemandNotice($demandNotice->id);
        $this->assertEquals($deleteDemandNotice, true);
        $this->assertDatabaseMissing("demand_Notices", $demandNotice->toArray());
    }

    public function test_to_see_if_a_new_demand_notice_can_be_created_with_arrears()
    {
        $property = Property::factory()->create();
        $createdAt = Carbon::now()->year(2023);

        // Create a new demand notice using the factory and set the created_at value
        DemandNotice::factory()->create([
            'property_id' => $property->id,
            'created_at' => $createdAt,
            'updated_at' => $createdAt, // Optionally, set updated_at to the same value
        ]);
        $createNewDemandNotice = (new DemandNoticeService())->createDemandNotice($property->id);
        $demandNoticeArray = $createNewDemandNotice->toArray();
        $demandNoticeArray['created_at'] = Carbon::parse($demandNoticeArray['created_at'])->format('Y-m-d H:i:s');
        $demandNoticeArray['updated_at'] = Carbon::parse($demandNoticeArray['updated_at'])->format('Y-m-d H:i:s');

        // Assert the demand notice was created in the database
        $this->assertDatabaseHas('demand_notices', $demandNoticeArray);
    }
    public function test_to_see_if_a_new_demand_notice_would_not_create_if_there_is_a_current_demand_notice()
    {
        $property = Property::factory()->create();
        // Create a new demand notice using the factory and set the created_at value
        DemandNotice::factory()->create([
            'property_id' => $property->id,
        ]);
        $createNewDemandNotice = (new DemandNoticeService())->createDemandNotice($property->id);

        $this->assertEquals(false, $createNewDemandNotice);
    }

    public function test_to_see_if_a_total_pending_demand_notice_can_be_counted_byYear()
    {
        // Create a mock model instance
        $mockModel = Mockery::mock(DemandNotice::class);
        $mockModel->factory(20)->create();
        // Set up the expectations for the model instance
        $mockModel->shouldReceive('whereYear')
            ->once()
            ->with('created_at', '2022')
            ->andReturnSelf();

        $mockModel->shouldReceive('where')
            ->once()
            ->with('status', DemandNotice::PENDING)
            ->andReturnSelf();

        $mockModel->shouldReceive('count')
            ->once()
            ->andReturn(5);

        // Create an instance of the class under test and inject the mock model
        $demandNoticeService = new DemandNoticeService($mockModel);

        // Call the method under test
        $result = $demandNoticeService->totalPendingDemandNoticeByYear('2022');

        // Assert that the result is correct
        $this->assertEquals(5, $result);
    }
}
