<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Resources;

use App\Modules\Booking\Models\BookingService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin BookingService */
class BookingServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'service_id' => $this->service_id,
            'name' => $this->name,
            'price' => (float) $this->price,
            'duration' => $this->duration,
            'quantity' => $this->quantity,
            'sort_order' => $this->sort_order,
        ];
    }
}
