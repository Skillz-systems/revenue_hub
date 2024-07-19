<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *     schema="RatingDistrictResource",
 *     type="object",
 *     title="Rating District Resource",
 *     description="A resource representing a rating district",
 *     @OA\Property(property="id", type="integer", example=1, description="The unique identifier of the rating district"),
 *     @OA\Property(property="name", type="string", example="hama district", description="The rating district name"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2023-01-01T12:00:00Z", description="The creation timestamp of the street"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2023-01-02T12:00:00Z", description="The last update timestamp of the street"),
 * )
 */
class RatingDistrictResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "name" => $this->name,
            "office_zone_id" => (new OfficeZoneResource($this->officeZone)),
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
        ];
    }
}
