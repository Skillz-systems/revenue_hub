<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;


/**
 * @OA\Schema(
 *     schema="StreetResource",
 *     type="object",
 *     title="Street Resource",
 *     description="A resource representing a street",
 *     @OA\Property(property="id", type="integer", example=1, description="The unique identifier of the street"),
 *     @OA\Property(property="name", type="string", example="Johnson Kay Steert", description="The street name"),
 *     @OA\Property( property="cadastral_zone", type="object",
 *          @OA\Property( property="id", type="integer", example=1),
 *          @OA\Property( property="name", type="string", example="OBIDINI"),
 *          @OA\Property( property="cadastral_zone_id", type="integer",  example=2)
 *     ),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2023-01-01T12:00:00Z", description="The creation timestamp of the street"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2023-01-02T12:00:00Z", description="The last update timestamp of the street"),
 * )
 */
class StreetResource extends JsonResource
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
            "cadastral_zone" => (new CadastralZoneResource($this->cadastralZone)),
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
        ];
    }
}
