<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Resources;

use App\Modules\Booking\Models\WaitingList;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin WaitingList */
class WaitingListResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'branch_id' => $this->branch_id,
            'customer_id' => $this->customer_id,
            'customer_name' => $this->whenLoaded('customer', fn () => $this->customer?->name),
            'customer_phone' => $this->whenLoaded('customer', fn () => $this->customer?->phone),
            'service_id' => $this->service_id,
            'service_name' => $this->whenLoaded('service', fn () => $this->service?->name),
            'preferred_date' => $this->preferred_date?->format('Y-m-d'),
            'preferred_time' => $this->preferred_time?->format('H:i'),
            'notes' => $this->notes,
            'status' => $this->status,
            'position' => $this->position,
            'notified_at' => $this->notified_at?->format('Y-m-d H:i:s'),
            'created_at' => $this->created_at?->format('d M Y H:i'),
        ];
    }
}
