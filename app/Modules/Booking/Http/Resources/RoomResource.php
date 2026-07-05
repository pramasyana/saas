<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Resources;

use App\Modules\Booking\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Room */
class RoomResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'branch_id' => $this->branch_id,
            'branch_name' => $this->whenLoaded('branch', fn () => $this->branch?->name),
            'name' => $this->name,
            'description' => $this->description,
            'capacity' => $this->capacity,
            'color' => $this->color,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->format('d M Y'),
        ];
    }
}
