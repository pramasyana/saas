<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Resources;

use App\Modules\Booking\Models\BookingReminder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin BookingReminder */
class ReminderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'booking_id' => $this->booking_id,
            'booking_code' => $this->whenLoaded('booking', fn () => $this->booking->booking_code),
            'customer_name' => $this->whenLoaded('booking.customer', fn () => $this->booking->customer?->name),
            'type' => $this->type,
            'status' => $this->status,
            'scheduled_at' => $this->scheduled_at?->format('Y-m-d H:i:s'),
            'sent_at' => $this->sent_at?->format('Y-m-d H:i:s'),
            'error_message' => $this->error_message,
            'created_at' => $this->created_at?->format('d M Y H:i'),
        ];
    }
}
