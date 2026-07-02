<?php

declare(strict_types=1);

namespace App\Modules\Service\Http\Resources;

use App\Modules\Service\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Package */
class PackageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => (float) $this->price,
            'duration' => $this->duration,
            'is_active' => $this->is_active,
            'services' => PackageServiceResource::collection($this->whenLoaded('services')),
            'services_count' => $this->whenLoaded('services', fn () => $this->services->count()),
            'created_at' => $this->created_at?->format('d M Y'),
        ];
    }
}
