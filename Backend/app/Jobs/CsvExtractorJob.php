<?php

namespace App\Jobs;

use App\Models\DemandNotice;
use Illuminate\Bus\Queueable;
use App\Service\StreetService;
use App\Service\PropertyUseService;
use App\Service\CadastralZoneService;
use App\Service\CategoryService;
use App\Service\GroupService;
use App\Service\PropertyService;
use App\Service\PropertyTypeService;
use App\Service\RatingDistrictService;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class CsvExtractorJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $data;
    /**
     * Create a new job instance.
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        switch ($this->data["for"]) {
            case "property":
                $this->property($this->data);
                break;
            case "property_use":
                $this->propertyUse($this->data);
                break;
            case "property_type":
                $this->propertyType($this->data);
                break;
            case "category":
                $this->category($this->data);
                break;
            case "group":
                $this->group($this->data);
                break;
            case "rating_district":
                $this->ratingDistrict($this->data);
                break;
            case "street":
                $this->street($this->data);
                break;
            case "cadastral_zone":
                $this->cadastralZone($this->data);
                break;
        }
    }

    private function propertyUse($data)
    {
        $data = $data["data"];
        foreach ($data as $propertyUse) {
            // check if the district already exists
            $checkExistingPropertyUse = (new PropertyUseService())->getPropertyUseFromPropertyUseName($propertyUse["property_use"]);

            if (!$checkExistingPropertyUse) {
                (new PropertyUseService())->create(["name" => $propertyUse["property_use"]]);
            }
        }
    }

    private function propertyType($data)
    {
        $data = $data["data"];
        foreach ($data as $propertyType) {
            // check if the property type already exists
            $checkExistingPropertyType = (new PropertyTypeService())->getPropertyTypeFromPropertyTypeName($propertyType["property_type"]);

            if (!$checkExistingPropertyType) {
                (new PropertyTypeService())->create(["name" => $propertyType["property_type"]]);
            }
        }
    }

    private function category($data)
    {
        $data = $data["data"];
        foreach ($data as $category) {
            // check if the district already exists
            $checkExistingCategory = (new CategoryService())->getCategoryFromCategoryName($category["category"]);

            if (!$checkExistingCategory) {
                (new CategoryService())->create(["name" => $category["category"]]);
            }
        }
    }

    private function group($data)
    {
        $data = $data["data"];
        foreach ($data as $group) {
            // check if the group already exists
            $checkExistingGroup = (new GroupService())->getGroupFromGroupName($group["group"]);

            if (!$checkExistingGroup) {
                (new GroupService())->create(["name" => $group["group"]]);
            }
        }
    }

    private function ratingDistrict($data)
    {
        $data = $data["data"];
        foreach ($data as $ratingDistricts) {
            // check if the district already exists
            $checkExistingRatingDistrict = (new RatingDistrictService())->getRatingDistrictFromDistrictName($ratingDistricts["rating_district"]);

            if (!$checkExistingRatingDistrict) {
                (new RatingDistrictService())->create(["name" => $ratingDistricts["rating_district"]]);
            }
        }
    }

    private function street($data)
    {
        $data = $data["data"];

        foreach ($data as $street) {
            // check if the cadastral Zone already exists
            $getCadastralZone = (new CadastralZoneService())->getCadastralZoneFromZoneName($street["cadastral_zone"]);
            $checkExistingStreets = (new StreetService())->getStreetFromStreetName($street["street"]);
            if (!$checkExistingStreets) {
                (new StreetService())->create(["cadastral_zone_id" => $getCadastralZone->id, "name" => $street["street"]]);
            }
        }
    }

    private function cadastralZone($data)
    {
        $data = $data["data"];

        foreach ($data as $cadastralZone) {
            // check if the cadastral Zone already exists
            $checkExistingCadastralZone = (new CadastralZoneService())->getCadastralZoneFromZoneName($cadastralZone["cadastral_zone"]);
            $getRatingDistrict = (new RatingDistrictService())->getRatingDistrictFromDistrictName($cadastralZone["rating_district"]);
            if (!$checkExistingCadastralZone) {
                (new CadastralZoneService())->create(["name" => $cadastralZone["cadastral_zone"], "rating_district_id" => $getRatingDistrict->id]);
            }
        }
    }

    private function property($data)
    {
        $data = $data["data"];
        $getPid = $data[0];
        $getOccupant = $data[1];
        $getAddress = $data[2];
        $getStreet = (new StreetService())->getStreetFromStreetName($data[3]);
        $getAssetNumber = $data[4];
        $getCadastralZone = (new CadastralZoneService())->getCadastralZoneFromZoneName($data[5]);
        $getPropertyType = (new PropertyTypeService())->getPropertyTypeFromPropertyTypeName($data[6]);
        $getPropertyUse = (new PropertyUseService())->getPropertyUseFromPropertyUseName($data[7]);
        $getRatingDistrict = (new RatingDistrictService())->getRatingDistrictFromDistrictName($data[8]);
        $getAnnualValue = str_replace(",", "", $data[9]);
        $getRatePayable = str_replace(",", "", $data[10]);
        $getArrears = str_replace(",", "", $data[11]);
        $getPenalty = str_replace(",", "", $data[12]);
        $getGrandTotal = str_replace(",", "", $data[13]);
        $getCategory = (new CategoryService())->getCategoryFromCategoryName($data[14]);
        $getGroup = (new GroupService())->getGroupFromGroupName($data[15]);
        $getActive = $data[16];
        $propertyData = [
            "pid" => $getPid,
            "occupant" => $getOccupant,
            "prop_addr" => $getAddress,
            "street_name" => $getStreet ? $getStreet->id : 0,
            "asset_no" => $getAssetNumber,
            "cadastral_zone" => $getCadastralZone ? $getCadastralZone->id : 0,
            "prop_type" => $getPropertyType ? $getPropertyType->id : 0,
            "prop_use" => $getPropertyUse ? $getPropertyUse->id : 0,
            "rating_dist" => $getRatingDistrict ? $getRatingDistrict->id : 0,
            "annual_value" => $getAnnualValue,
            "rate_payable" =>  $getRatePayable,
            "grand_total" =>  $getGrandTotal,
            "category" => $getCategory ? $getCategory->id : 0,
            "group" => $getGroup ? $getGroup->id : 0,
            "active" => $getActive,
        ];
        $createProperty = (new PropertyService())->storeProperty(new Request($propertyData));
        if ($createProperty) {
            // check if there is areas and create a demand notice with the property backdated 
            if ($getArrears > 0) {
                $demandNoticeData = [
                    "property_id" => $createProperty->id,
                    "arrears_amount" => $getArrears,
                    "amount" => $getGrandTotal,
                    "penalty" =>  $getPenalty,
                    "created_at" => Carbon::now()->subYear(),
                    "updated_at" => Carbon::now()->subYear(),
                ];
                $this->createDemandNotice($demandNoticeData);
            }
        }
    }

    private function createDemandNotice($data)
    {
        DemandNotice::create($data);
    }
}
