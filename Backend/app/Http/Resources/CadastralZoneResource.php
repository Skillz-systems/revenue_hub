<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *     schema="CadastralZoneResource",
 *     type="object",
 *     title="Cadastral Zone Resource",
 *     description="A resource representing a street",
 *     @OA\Property(property="id", type="integer", example=1, description="The unique identifier of the cadastral zone"),
 *     @OA\Property(property="name", type="string", example="Johnson Kay Steert", description="The cadastral zone name"),
 *     @OA\Property(property="rating_district_id", type="string", example="2", description="The rating district id"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2023-01-01T12:00:00Z", description="The creation timestamp of the street"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2023-01-02T12:00:00Z", description="The last update timestamp of the street"),
 * )
 */
class CadastralZoneResource extends JsonResource
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
            "rating_district_id" => $this->rating_district_id,
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
        ];
    }
}
