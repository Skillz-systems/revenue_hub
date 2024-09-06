<?php

namespace App\Service;

use App\Http\Resources\StoreUserResource;
use App\Models\DemandNoticeReminder;
use App\Models\DemandNotice;
use App\Models\Property;

class DemandNoticeService
{
    public function allDemandNotice($date)
    {
        return $this->model()->whereYear('created_at', $date)->paginate(100);
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
    public function createReminder(DemandNotice $demandNotice)
    {
        if ($demandNotice->status === DemandNotice::PENDING && !$demandNotice->reminder) {
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



    public function model()
    {
        return new DemandNotice();
    }
}
