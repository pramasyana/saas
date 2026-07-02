<?php

declare(strict_types=1);

namespace App\Modules\Booking\Actions;

use App\Modules\Booking\Contracts\BookingRepositoryInterface;
use App\Modules\Booking\Contracts\BookingStatusLogRepositoryInterface;
use App\Modules\Booking\Events\BookingCreated;
use App\Modules\Booking\Models\Booking;
use Illuminate\Support\Facades\DB;

class CreateBookingAction
{
    public function __construct(
        private readonly BookingRepositoryInterface $bookingRepository,
        private readonly BookingStatusLogRepositoryInterface $statusLogRepository,
    ) {}

    public function execute(array $data, ?string $tenantId = null): Booking
    {
        return DB::transaction(function () use ($data, $tenantId) {
            $bookingData = $data;
            if ($tenantId !== null) {
                $bookingData['tenant_id'] = $tenantId;
            }

            $booking = $this->bookingRepository->create($bookingData);

            $this->statusLogRepository->create([
                'booking_id' => $booking->id,
                'from_status' => null,
                'to_status' => $booking->status,
                'changed_by' => auth()->id() ?? 'system',
            ]);

            if (! empty($data['services'])) {
                $booking->services()->createMany($data['services']);
            }

            event(new BookingCreated($booking));

            return $booking->load(['customer', 'staff', 'services']);
        });
    }
}
