<?php

namespace App\Service;

use App\Http\Resources\StoreUserResource;
use App\Models\BatchDemandNotice;
use App\Models\DemandNoticeReminder;
use App\Models\DemandNotice;
use App\Models\Property;
use Illuminate\Support\Carbon;
use DB;
use Illuminate\Bus\Batch;

class DemandNoticeService
{
    public function allDemandNotice($date)
    {
        return $this->model()->whereYear('created_at', $date)->orderBy('created_at', 'desc')->simplePaginate(10);
    }
    public function viewDemandNotice($id)
    {
        return $this->model()->findOrFail($id);
    }
    public function createDemandNotice($id)
    {
        // get property 
        $getProperty = (new PropertyService())->getPropertyById($id);
        $getDemandNotice = $getProperty->demandNotices()->latest()->first();
        $currentYear = date("Y");
        $data = [
            "property_id" => $getProperty->id,
        ];
        if ($getDemandNotice) {
            //$getDemandNotice = $getDemandNotice
            if ($currentYear > $getDemandNotice->created_at) {
                if ($getDemandNotice->status == DemandNotice::PENDING) {
                    $penalty = ($getDemandNotice->amount * Property::PENALTY) / 100;
                    $data["arrears_amount"] = $getDemandNotice->amount + $penalty;
                    $data["penalty"] =  $penalty;
                    $data["amount"] =  $getProperty->rate_payable + $getDemandNotice->amount + $penalty;
                    return  $this->model()->create($data);
                }
                $data["amount"] =  $getProperty->rate_payable;
                return $this->model()->create($data);
            }
            return false;
        }
        $data["amount"] =  $getProperty->rate_payable;
        return $this->model()->create($data);

        //check the demand notice status if its paid and check that the demand notice year is not the current year 

    }
    public function createReminder($demandNotice)
    {
        if ($demandNotice->status == DemandNotice::PENDING && empty($demandNotice->reminder)) {
            $reminder = new DemandNoticeReminder();
            $reminder->demand_notice_id = $demandNotice->id;
            $reminder->save();
            return $reminder;
        }
        return false;
    }
    public function updateDemandNotice($id, $data)
    {
        $demandNotice = $this->viewDemandNotice($id);
        return $demandNotice->update($data);
    }
    public function deleteDemandNotice($id)
    {
        $demandNotice = $this->viewDemandNotice($id);
        return $demandNotice->delete();
    }

    public function demandNoticeYearAmountSum($date)
    {
        return $this->model()->whereYear('created_at', $date)->sum('amount');
    }

    public function totalPaidDemandNoticeByYear($date)
    {
        return $this->model()->whereYear('created_at', $date)->where('status', DemandNotice::PAID)->count();
    }
    public function totalPendingDemandNoticeByYear($date)
    {
        return $this->model()->whereYear('created_at', $date)->where('status', DemandNotice::PENDING)->count();
    }

    public function getAllPaidDemandNoticeByYear($date)
    {
        return $this->model()->whereYear('created_at', $date)->where('status', DemandNotice::PAID)->paginate(100);
    }

    public function getAllPendingDemandNoticeByYearPaginated($date)
    {
        return $this->model()->whereYear('created_at', $date)->where('status', DemandNotice::PENDING)->paginate(100);
    }
    public function totalGeneratedDemandNoticeByYear($date)
    {
        return $this->model()->whereYear('created_at', $date)->count();
    }

    public function colorStatus(DemandNotice $demandNotice)
    {
        $createdAt = Carbon::parse($demandNotice->created_at);
        $now = Carbon::now();
        $daysSinceCreation = $now->diffInDays($createdAt);
        if ($demandNotice->status === 0) {
            if ($daysSinceCreation <= 28) {
                return 0;
            }
            if ($demandNotice->reminder) {
                $daysSinceReminder = $now->diffInDays($demandNotice->reminder->created_at);
                if ($daysSinceCreation > 28 && $daysSinceReminder <= 28) {
                    return 1;
                }
                if ($daysSinceReminder > 28) {
                    return 4;
                }
            } else {
                return 2;
            }
        }
        if ($demandNotice->status == 1) {
            return 3;
        }
        return -1;
    }

    public function createBulkDemandNotice($data)
    {
        $currentYear = date('Y');
        $chunkSize = 10000; // Adjust chunk size based on server capacity
        //search if batch demand notice already exist
        $getBatchDemandNotice = BatchDemandNotice::where([
            'street_id' => $data['street_id'],
            'cadastral_zone_id' => $data['cadastral_zone_id'],
            'rating_district_id' => $data['rating_district_id'],
        ])->whereYear('created_at', $currentYear)->first();

        if (!empty($getBatchDemandNotice)) {
            return false;
        }

        $batchDemandNotice = BatchDemandNotice::create($data);
        if ($batchDemandNotice) {
            $this->getAllPropertyWithFilters($data)
                ->chunk($chunkSize, function ($properties) use ($currentYear) {
                    $propertyIds = $properties->pluck('id')->toArray();

                    // Fetch the latest demand notices for the chunked properties
                    $latestDemandNotices = DemandNotice::whereIn('property_id', $propertyIds)
                        ->latest('created_at')
                        ->get()
                        ->keyBy('property_id');

                    $demandNotices = [];

                    foreach ($properties as $property) {
                        $getDemandNotice = $latestDemandNotices->get($property->id);
                        $data = [
                            'property_id' => $property->id,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];

                        if ($getDemandNotice) {
                            $demandYear = $getDemandNotice->created_at->year;

                            if ($currentYear > $demandYear) {
                                if ($getDemandNotice->status == DemandNotice::PENDING) {
                                    $penalty = ($getDemandNotice->amount * Property::PENALTY) / 100;
                                    $data['arrears_amount'] = $getDemandNotice->amount + $penalty;
                                    $data['penalty'] = $penalty;
                                    $data['amount'] = $property->rate_payable + $getDemandNotice->amount + $penalty;
                                } else {
                                    $data['amount'] = $property->rate_payable;
                                }
                                $demandNotices[] = $data;
                            }
                        } else {
                            $data['amount'] = $property->rate_payable;
                            $demandNotices[] = $data;
                        }
                    }

                    if (!empty($demandNotices)) {
                        DemandNotice::insert($demandNotices); // Batch insert for the chunk
                    }
                });

            return true;
        }
        return false;
    }


    public function getAllPropertyWithFilters(array $filters = [])
    {
        $query = Property::query();

        $query->leftJoin('demand_notices', function ($join) {
            $join->on('demand_notices.property_id', '=', 'properties.id')
                ->whereYear('demand_notices.created_at', date('Y'));
        })
            ->select('properties.*')
            ->whereNull('demand_notices.id') // Exclude properties with demand notices
            ->where([
                'street_id' => $filters['street_id'],
                'cadastral_zone_id' => $filters['cadastral_zone_id'],
                'rating_district_id' => $filters['rating_district_id'],
            ]);

        return $query; // Fetch all without pagination
    }




    public function getCurrentYearDemandNotices($ratingDistrict, $cadastralZone, $street)
    {
        $currentYear = Carbon::now()->year;

        $demandNotices = DemandNotice::whereYear('created_at', $currentYear)
            ->whereHas('property', function ($query) use ($ratingDistrict, $cadastralZone, $street) {
                $query->where('rating_district_id', $ratingDistrict)
                    ->where('cadastral_zone_id', $cadastralZone)
                    ->where('street_id', $street);
            })
            ->get();

        return $demandNotices;
    }

    public function getBatchDemandNoticesById($id)
    {
        return BatchDemandNotice::findOrFail($id);
    }

    public function getAllBatchDemandNoticesCurrentYear()
    {
        return BatchDemandNotice::whereYear('created_at', date('Y'))->get();
    }

    public function fetchBatchForPrinting($id)
    {
        $batchDemandNotice = $this->getBatchDemandNoticesById($id);
        if ($batchDemandNotice) {
            $getDemandNotice = $this->getCurrentYearDemandNotices($batchDemandNotice->rating_district_id, $batchDemandNotice->cadastral_zone_id, $batchDemandNotice->street_id);
            if ($getDemandNotice) {
                return $getDemandNotice;
            }
        }
        return false;
    }
    public function model()
    {
        return new DemandNotice();
    }
}
