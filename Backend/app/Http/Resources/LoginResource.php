<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LoginResource extends JsonResource
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
            "message" => "Login Successfully",
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
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at,
            ],
            "token" => $this->createToken("API TOKEN")->plainTextToken
        ];
    }
}
