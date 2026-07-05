<?php

declare(strict_types=1);

namespace App\Modules\Booking\Actions;

use App\Modules\Booking\Contracts\BookingRepositoryInterface;
use App\Modules\Booking\Contracts\BookingStatusLogRepositoryInterface;
use App\Modules\Booking\Events\BookingCreated;
use App\Modules\Booking\Models\Booking;
use App\Modules\Booking\Models\BookingRecurringTemplate;
use App\Modules\Crm\Services\MembershipBenefitService;
use Illuminate\Support\Facades\DB;

class CreateBookingAction
{
    public function __construct(
        private readonly BookingRepositoryInterface $bookingRepository,
        private readonly BookingStatusLogRepositoryInterface $statusLogRepository,
        private readonly MembershipBenefitService $benefitService,
    ) {}

    public function execute(array $data, ?string $tenantId = null): Booking
    {
        return DB::transaction(function () use ($data, $tenantId) {
            $bookingData = $data;
            if ($tenantId !== null) {
                $bookingData['tenant_id'] = $tenantId;
            }

            unset($bookingData['services'], $bookingData['rooms'], $bookingData['participants'], $bookingData['recurring']);

            $bookingData['total_guests'] ??= 1;

            $booking = $this->bookingRepository->create($bookingData);

            $this->statusLogRepository->create([
                'booking_id' => $booking->id,
                'from_status' => null,
                'to_status' => $booking->status,
                'changed_by' => auth()->id() ?? 'system',
            ]);

            if (! empty($data['recurring'])) {
                $recurringData = $data['recurring'];
                $template = BookingRecurringTemplate::create([
                    'tenant_id' => $booking->tenant_id,
                    'source_booking_id' => $booking->id,
                    'frequency' => $recurringData['frequency'],
                    'interval' => $recurringData['interval'] ?? 1,
                    'days_of_week' => $recurringData['days_of_week'] ?? null,
                    'end_type' => $recurringData['end_type'],
                    'count' => $recurringData['count'] ?? null,
                    'until_date' => $recurringData['until_date'] ?? null,
                    'next_generation_date' => $booking->start_time->copy()->addDay()->startOfDay(),
                    'is_active' => true,
                ]);

                $booking->update(['recurring_template_id' => $template->id]);
            }

            if (! empty($data['participants'])) {
                $booking->participants()->createMany($data['participants']);
            }

            if (! empty($data['rooms'])) {
                $booking->rooms()->attach($data['rooms']);
            }

            if (! empty($data['services'])) {
                $benefits = $this->benefitService->getCustomerBenefits($data['customer_id']);

                foreach ($data['services'] as $svcData) {
                    $addons = $svcData['addons'] ?? [];
                    unset($svcData['addons']);

                    if ($benefits['discount_percent'] > 0) {
                        $svcData['price'] = round(
                            (float) $svcData['price'] * (1 - $benefits['discount_percent'] / 100),
                            2,
                        );
                    }

                    $bookingService = $booking->services()->create($svcData);

                    if (! empty($addons)) {
                        $addonDataWithBenefits = array_map(
                            fn (array $addon) => [
                                ...$addon,
                                'price' => $benefits['free_add_on']
                                    ? 0
                                    : ($benefits['discount_percent'] > 0
                                        ? round(
                                            (float) ($addon['price'] ?? 0) * (1 - $benefits['discount_percent'] / 100),
                                            2,
                                        )
                                        : ($addon['price'] ?? 0)),
                            ],
                            $addons,
                        );

                        $bookingService->addons()->createMany($addonDataWithBenefits);
                    }
                }
            }

            event(new BookingCreated($booking));

            return $booking->load(['customer', 'staff', 'services', 'services.addons', 'rooms', 'participants']);
        });
    }
}
