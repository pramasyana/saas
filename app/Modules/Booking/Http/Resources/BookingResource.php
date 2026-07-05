<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Resources;

use App\Modules\Booking\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Booking */
class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'booking_code' => $this->booking_code,
            'branch_id' => $this->branch_id,
            'branch_name' => $this->whenLoaded('branch', fn () => $this->branch?->name),
            'customer_id' => $this->customer_id,
            'customer_name' => $this->whenLoaded('customer', fn () => $this->customer?->name),
            'customer_phone' => $this->whenLoaded('customer', fn () => $this->customer?->phone),
            'staff_id' => $this->staff_id,
            'staff_name' => $this->whenLoaded('staff', fn () => $this->staff?->name),
            'start_time' => $this->start_time?->format('Y-m-d H:i:s'),
            'end_time' => $this->end_time?->format('Y-m-d H:i:s'),
            'duration_minutes' => $this->duration_minutes,
            'status' => $this->status,
            'source' => $this->source,
            'notes' => $this->notes,
            'total_guests' => $this->total_guests ?? 1,
            'guest_details' => $this->guest_details,
            'services' => BookingServiceResource::collection($this->whenLoaded('services')),
            'reminders' => ReminderResource::collection($this->whenLoaded('reminders')),
            'status_logs' => $this->whenLoaded('statusLogs', fn () => $this->statusLogs->map(fn ($log) => [
                'from_status' => $log->from_status,
                'to_status' => $log->to_status,
                'changed_by' => $log->changed_by,
                'changed_by_name' => $log->relationLoaded('changedByUser') ? $log->changedByUser?->name : null,
                'notes' => $log->notes,
                'created_at' => $log->created_at?->format('Y-m-d H:i:s'),
            ])),
            'created_at' => $this->created_at?->format('d M Y H:i'),
        ];
    }
}
