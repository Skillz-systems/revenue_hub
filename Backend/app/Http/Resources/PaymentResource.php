<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "tx_ref" => $this->tx_ref,
            "pin" => $this->flw_ref,
            "demand_notice" => new DemandNoticeResource($this->demandNotice),
            "actual_amount" => $this->actual_amount,
            "charged_amount" => $this->charged_amount,
            "app_fee" => $this->app_fee,
            "merchant_fee" => $this->merchant_fee,
            "status" => $this->status,
        ];
    }
}
