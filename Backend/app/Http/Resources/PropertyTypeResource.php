<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;


/**
 * @OA\Schema(
 *     schema="PropertyTypeResource",
 *     type="object",
 *     title="Property Type Resource",
 *     description="A resource representing a property type",
 *     @OA\Property(property="id", type="integer", example=1, description="The unique identifier of the property type"),
 *     @OA\Property(property="name", type="string", example="Duplex", description="The name of the property type"),
 *     @OA\Property(property="property_type_id", type="string", example="2", description="The property type id zone id"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2023-01-01T12:00:00Z", description="The creation timestamp of the property type"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2023-01-02T12:00:00Z", description="The last update timestamp of the property type"),
 * )
 */
class PropertyTypeResource extends JsonResource
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
            "property_type_id" => $this->property_type_id,
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
        ];
    }
}

