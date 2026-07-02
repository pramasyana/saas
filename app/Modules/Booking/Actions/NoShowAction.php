<?php

declare(strict_types=1);

namespace App\Modules\Booking\Actions;

use App\Modules\Booking\Contracts\BookingRepositoryInterface;
use App\Modules\Booking\Contracts\BookingStatusLogRepositoryInterface;
use App\Modules\Booking\Events\BookingNoShow;
use App\Modules\Booking\Models\Booking;
use Illuminate\Support\Facades\DB;

class NoShowAction
{
    public function __construct(
        private readonly BookingRepositoryInterface $bookingRepository,
        private readonly BookingStatusLogRepositoryInterface $statusLogRepository,
    ) {}

    public function execute(string $id): Booking
    {
        return DB::transaction(function () use ($id) {
            $booking = $this->bookingRepository->findOrFail($id);

            $this->bookingRepository->update($booking, ['status' => 'no_show']);

            $this->statusLogRepository->create([
                'booking_id' => $booking->id,
                'from_status' => $booking->status,
                'to_status' => 'no_show',
                'changed_by' => auth()->id() ?? 'system',
            ]);

            event(new BookingNoShow($booking));

            return $booking->fresh(['customer', 'staff']);
        });
    }
}
