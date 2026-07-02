<?php

declare(strict_types=1);

namespace App\Modules\Booking\Actions;

use App\Modules\Booking\Contracts\BookingRepositoryInterface;
use App\Modules\Booking\Contracts\BookingStatusLogRepositoryInterface;
use App\Modules\Booking\Events\BookingRescheduled;
use App\Modules\Booking\Models\Booking;
use Illuminate\Support\Facades\DB;

class RescheduleBookingAction
{
    public function __construct(
        private readonly BookingRepositoryInterface $bookingRepository,
        private readonly BookingStatusLogRepositoryInterface $statusLogRepository,
    ) {}

    public function execute(string $id, array $newSchedule): Booking
    {
        return DB::transaction(function () use ($id, $newSchedule) {
            $booking = $this->bookingRepository->findOrFail($id);
            $oldData = [
                'start_time' => $booking->start_time->toDateTimeString(),
                'end_time' => $booking->end_time->toDateTimeString(),
                'staff_id' => $booking->staff_id,
            ];

            $this->bookingRepository->update($booking, $newSchedule);

            $this->statusLogRepository->create([
                'booking_id' => $booking->id,
                'from_status' => $booking->status,
                'to_status' => $booking->status,
                'changed_by' => auth()->id() ?? 'system',
                'notes' => 'Rescheduled from '.$oldData['start_time'].' to '.($newSchedule['start_time'] ?? ''),
            ]);

            event(new BookingRescheduled($booking, $oldData));

            return $booking->fresh(['customer', 'staff']);
        });
    }
}
