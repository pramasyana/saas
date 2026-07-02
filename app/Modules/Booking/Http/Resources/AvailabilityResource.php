<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AvailabilityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'date' => $this['date'],
            'available' => $this['available'],
            'reason' => $this['reason'] ?? null,
            'slots' => $this['slots'] ?? [],
        ];
    }
}
