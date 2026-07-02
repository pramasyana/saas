<?php

declare(strict_types=1);

namespace App\Modules\Booking\Actions;

use App\Modules\Booking\Contracts\BookingRepositoryInterface;
use App\Modules\Booking\Contracts\BookingStatusLogRepositoryInterface;
use App\Modules\Booking\Events\BookingConfirmed;
use App\Modules\Booking\Models\Booking;
use Illuminate\Support\Facades\DB;

class ConfirmBookingAction
{
    public function __construct(
        private readonly BookingRepositoryInterface $bookingRepository,
        private readonly BookingStatusLogRepositoryInterface $statusLogRepository,
    ) {}

    public function execute(string $id): Booking
    {
        return DB::transaction(function () use ($id) {
            $booking = $this->bookingRepository->findOrFail($id);

            if ($booking->status !== 'pending') {
                throw new \RuntimeException('Only pending bookings can be confirmed.');
            }

            $this->bookingRepository->update($booking, ['status' => 'confirmed']);

            $this->statusLogRepository->create([
                'booking_id' => $booking->id,
                'from_status' => 'pending',
                'to_status' => 'confirmed',
                'changed_by' => auth()->id() ?? 'system',
            ]);

            event(new BookingConfirmed($booking));

            return $booking->fresh(['customer', 'staff']);
        });
    }
}
