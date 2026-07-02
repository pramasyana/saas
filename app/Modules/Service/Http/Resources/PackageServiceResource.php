<?php

declare(strict_types=1);

namespace App\Modules\Service\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PackageServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'package_id' => $this->pivot?->package_id ?? $this->package_id,
            'service_id' => $this->id,
            'name' => $this->name,
            'duration' => $this->duration,
            'price' => (float) $this->price,
            'quantity' => (int) ($this->pivot?->quantity ?? 1),
            'sort_order' => (int) ($this->pivot?->sort_order ?? 0),
        ];
    }
}
