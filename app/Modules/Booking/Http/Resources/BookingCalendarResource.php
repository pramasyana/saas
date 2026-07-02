<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Resources;

use App\Modules\Booking\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Booking */
class BookingCalendarResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $customer = $this->whenLoaded('customer');

        return [
            'id' => $this->id,
            'title' => $customer ? $customer->name : 'No Customer',
            'start' => $this->start_time?->format('Y-m-d\TH:i:s'),
            'end' => $this->end_time?->format('Y-m-d\TH:i:s'),
            'backgroundColor' => $this->getStatusColor(),
            'borderColor' => $this->getStatusColor(),
            'textColor' => '#ffffff',
            'extendedProps' => [
                'status' => $this->status,
                'source' => $this->source,
                'customer_name' => $customer?->name,
                'customer_phone' => $customer?->phone,
                'staff_name' => $this->whenLoaded('staff', fn () => $this->staff?->name),
                'duration_minutes' => $this->duration_minutes,
                'notes' => $this->notes,
                'services' => $this->whenLoaded('services', fn () => $this->services->pluck('name')),
            ],
        ];
    }

    private function getStatusColor(): string
    {
        return match ($this->status) {
            'pending' => '#F59E0B',
            'confirmed' => '#3B82F6',
            'in_progress' => '#10B981',
            'completed' => '#6B7280',
            'cancelled' => '#EF4444',
            'no_show' => '#EC4899',
            default => '#6B7280',
        };
    }
}
