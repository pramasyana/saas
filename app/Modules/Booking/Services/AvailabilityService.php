<?php

declare(strict_types=1);

namespace App\Modules\Booking\Services;

use App\Modules\Booking\Contracts\BookingRepositoryInterface;
use App\Modules\Company\Contracts\HolidayRepositoryInterface;
use App\Modules\Company\Contracts\WorkingHourRepositoryInterface;
use App\Modules\Staff\Contracts\LeaveRepositoryInterface;
use App\Modules\Staff\Contracts\ScheduleRepositoryInterface;
use App\Modules\Staff\Contracts\StaffRepositoryInterface;
use Illuminate\Support\Collection;

class AvailabilityService
{
    public function __construct(
        private readonly BookingRepositoryInterface $bookingRepository,
        private readonly WorkingHourRepositoryInterface $workingHourRepository,
        private readonly HolidayRepositoryInterface $holidayRepository,
        private readonly StaffRepositoryInterface $staffRepository,
        private readonly ScheduleRepositoryInterface $scheduleRepository,
        private readonly LeaveRepositoryInterface $leaveRepository,
    ) {}

    public function getTenantId(): string
    {
        return tenant()->getTenantKey();
    }

    public function getAvailableSlots(string $date, string $serviceId, int $duration, ?string $branchId = null, ?string $staffId = null): array
    {
        $tenantId = $this->getTenantId();
        $dayOfWeek = (int) date('w', strtotime($date));

        $holidays = $this->holidayRepository->findAllByTenant($tenantId, ['date' => $date]);
        if ($holidays->isNotEmpty()) {
            return ['date' => $date, 'available' => false, 'reason' => 'Holiday', 'slots' => []];
        }

        $workingHours = $this->workingHourRepository->findAllByTenant($tenantId, $branchId);
        $dayWh = $workingHours->firstWhere('day_of_week', $dayOfWeek);

        if ($dayWh === null || ! $dayWh->is_open) {
            return ['date' => $date, 'available' => false, 'reason' => 'Day off', 'slots' => []];
        }

        $staffCollection = $this->getAvailableStaff($tenantId, $date, $dayOfWeek, $branchId, $staffId);
        if ($staffCollection->isEmpty()) {
            return ['date' => $date, 'available' => false, 'reason' => 'No available staff', 'slots' => []];
        }

        $slots = $this->generateTimeSlots(
            $tenantId,
            $date,
            $dayWh->open_time instanceof \Carbon\CarbonImmutable ? $dayWh->open_time->format('H:i') : $dayWh->open_time,
            $dayWh->close_time instanceof \Carbon\CarbonImmutable ? $dayWh->close_time->format('H:i') : $dayWh->close_time,
            $duration,
            $staffCollection,
        );

        return [
            'date' => $date,
            'available' => ! empty($slots),
            'slots' => $slots,
        ];
    }

    private function getAvailableStaff(string $tenantId, string $date, int $dayOfWeek, ?string $branchId = null, ?string $staffId = null): Collection
    {
        $allStaff = $this->staffRepository->findAllByTenant($tenantId);

        if ($branchId !== null) {
            $allStaff = $allStaff->where('branch_id', $branchId);
        }

        if ($staffId !== null) {
            $allStaff = $allStaff->where('id', $staffId);
        }

        $schedules = $this->scheduleRepository->findByTenant($tenantId);

        return $allStaff->filter(function ($staff) use ($tenantId, $date, $dayOfWeek, $schedules) {
            $schedule = $schedules->firstWhere(fn ($s) => $s->staff_id === $staff->id && $s->day_of_week === $dayOfWeek);

            if ($schedule === null || ! $schedule->is_active) {
                return false;
            }

            $leaveCount = $this->leaveRepository->countByStaffAndDateRange($tenantId, $staff->id, $date, $date);

            if ($leaveCount > 0) {
                return false;
            }

            return true;
        })->values();
    }

    private function generateTimeSlots(string $tenantId, string $date, string $openTime, string $closeTime, int $duration, Collection $staffList): array
    {
        $open = strtotime("$date $openTime");
        $close = strtotime("$date $closeTime");
        $interval = 30;
        $slots = [];

        for ($time = $open; $time + ($duration * 60) <= $close; $time += $interval * 60) {
            $startSlot = date('Y-m-d H:i:s', $time);
            $endSlot = date('Y-m-d H:i:s', $time + ($duration * 60));

            $availableStaff = $staffList->filter(function ($staff) use ($tenantId, $startSlot, $endSlot) {
                $overlaps = $this->bookingRepository->getOverlappingBookings(
                    $tenantId,
                    $staff->id,
                    $startSlot,
                    $endSlot,
                );

                return $overlaps->isEmpty();
            });

            if ($availableStaff->isNotEmpty()) {
                $slots[] = [
                    'time' => date('H:i', $time),
                    'start_time' => $startSlot,
                    'end_time' => $endSlot,
                    'staff' => $availableStaff->map(fn ($s) => [
                        'id' => $s->id,
                        'name' => $s->name,
                    ]),
                ];
            }
        }

        return $slots;
    }
}
