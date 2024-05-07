<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShowUserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "status" => "success",
            "message" => "Update Successfully",
            "user" => [
                'id' => $this->id,
                'name' => $this->name,
                'email' => $this->email,
                'phone' => $this->phone,
                'zone' => $this->zone,
                'role' => [
                    'id' => $this->role->id,
                    'name' => $this->role->name,
                ],
            ],
        ];
    }
}
