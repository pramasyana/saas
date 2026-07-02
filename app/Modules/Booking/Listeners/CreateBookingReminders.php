<?php

declare(strict_types=1);

namespace App\Modules\Booking\Listeners;

use App\Modules\Booking\Contracts\BookingReminderRepositoryInterface;
use App\Modules\Booking\Events\BookingCreated;
use Illuminate\Contracts\Queue\ShouldQueue;

class CreateBookingReminders implements ShouldQueue
{
    public function __construct(
        private readonly BookingReminderRepositoryInterface $reminderRepository,
    ) {}

    public function handle(BookingCreated $event): void
    {
        $booking = $event->booking;
        $scheduledAt = $booking->start_time->copy()->subHours(24);

        if ($scheduledAt->isPast()) {
            return;
        }

        $this->reminderRepository->create([
            'booking_id' => $booking->id,
            'type' => 'email',
            'status' => 'pending',
            'scheduled_at' => $scheduledAt,
        ]);
    }
}
