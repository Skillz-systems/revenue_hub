<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *     schema="OfficeZoneResource",
 *     type="object",
 *     title="Office Zone Resource",
 *     description="A resource representing a street",
 *     @OA\Property(property="id", type="integer", example=1, description="The unique identifier of the office zone"),
 *     @OA\Property(property="name", type="string", example="Apo Zone", description="The office zone name"),
 *     @OA\Property(property="address", type="string", example="Johnson Kay Steert", description="The office zone address"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2023-01-01T12:00:00Z", description="The creation timestamp of the street"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2023-01-02T12:00:00Z", description="The last update timestamp of the street"),
 * )
 */
class OfficeZoneResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'address' => $this->address,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
