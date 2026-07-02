<?php

declare(strict_types=1);

namespace App\Modules\Service\Http\Resources;

use App\Modules\Service\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Service */
class ServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category_id' => $this->category_id,
            'category_name' => $this->whenLoaded('category', fn () => $this->category?->name),
            'name' => $this->name,
            'description' => $this->description,
            'duration' => $this->duration,
            'price' => (float) $this->price,
            'color' => $this->color,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->format('d M Y'),
        ];
    }
}
