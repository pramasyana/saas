<?php

declare(strict_types=1);

namespace App\Modules\Crm\Listeners;

use App\Modules\Booking\Events\BookingCancelled;
use App\Modules\Booking\Events\BookingCheckedIn;
use App\Modules\Booking\Events\BookingCompleted;
use App\Modules\Booking\Events\BookingConfirmed;
use App\Modules\Booking\Events\BookingCreated;
use App\Modules\Booking\Events\BookingNoShow;
use App\Modules\Booking\Events\BookingRescheduled;
use App\Modules\Booking\Models\Booking;
use App\Modules\Crm\Contracts\TimelineEventRepositoryInterface;

class RecordBookingTimeline
{
    public function __construct(
        private readonly TimelineEventRepositoryInterface $timelineEventRepository,
    ) {}

    public function handle(
        BookingCreated|BookingConfirmed|BookingRescheduled|BookingCancelled|BookingCheckedIn|BookingCompleted|BookingNoShow $event,
    ): void {
        $booking = $event->booking;
        $tenantId = $booking->tenant_id;

        $description = match ($event::class) {
            BookingCreated::class => 'Booking baru dibuat',
            BookingConfirmed::class => 'Booking dikonfirmasi',
            BookingRescheduled::class => 'Booking dijadwalkan ulang',
            BookingCancelled::class => 'Booking dibatalkan',
            BookingCheckedIn::class => 'Customer check-in',
            BookingCompleted::class => 'Booking selesai',
            BookingNoShow::class => 'Customer tidak hadir',
            default => 'Status booking berubah',
        };

        $description .= ' #' . $booking->booking_code;

        $metadata = [
            'booking_id' => $booking->id,
            'booking_code' => $booking->booking_code,
            'status' => $booking->status,
            'staff_name' => $booking->staff?->name,
            'start_time' => $booking->start_time?->toIso8601String(),
        ];

        if ($event instanceof BookingRescheduled) {
            $metadata['old_start_time'] = $event->oldData['start_time'] ?? null;
        }

        $this->timelineEventRepository->create([
            'tenant_id' => $tenantId,
            'customer_id' => $booking->customer_id,
            'user_id' => auth()->id(),
            'type' => 'booking',
            'description' => $description,
            'metadata' => $metadata,
        ]);
    }
}
