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

            unset($bookingData['services']);

            $bookingData['total_guests'] ??= 1;

            $booking = $this->bookingRepository->create($bookingData);

            $this->statusLogRepository->create([
                'booking_id' => $booking->id,
                'from_status' => null,
                'to_status' => $booking->status,
                'changed_by' => auth()->id() ?? 'system',
            ]);

            if (! empty($data['services'])) {
                foreach ($data['services'] as $svcData) {
                    $addons = $svcData['addons'] ?? [];
                    unset($svcData['addons']);

                    $bookingService = $booking->services()->create($svcData);

                    if (! empty($addons)) {
                        $bookingService->addons()->createMany($addons);
                    }
                }
            }

            event(new BookingCreated($booking));

            return $booking->load(['customer', 'staff', 'services', 'services.addons']);
        });
    }
}
