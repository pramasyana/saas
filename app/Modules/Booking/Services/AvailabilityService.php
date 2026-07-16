<?php

declare(strict_types=1);

namespace App\Modules\Booking\Services;

use App\Modules\Booking\Contracts\BookingRepositoryInterface;
use App\Modules\Booking\Contracts\RoomRepositoryInterface;
use App\Modules\Booking\Models\Room;
use App\Modules\Company\Contracts\HolidayRepositoryInterface;
use App\Modules\Company\Contracts\WorkingHourRepositoryInterface;
use App\Modules\Crm\Models\CustomerStaffPreference;
use App\Modules\Setting\Services\TenantSettingService;
use App\Modules\Staff\Contracts\LeaveRepositoryInterface;
use App\Modules\Staff\Contracts\ScheduleRepositoryInterface;
use App\Modules\Staff\Contracts\StaffRepositoryInterface;
use App\Modules\Staff\Models\StaffShiftAssignment;
use Illuminate\Support\Collection;

use App\Modules\Service\Models\Service;

class AvailabilityService
{
    public function __construct(
        private readonly BookingRepositoryInterface $bookingRepository,
        private readonly WorkingHourRepositoryInterface $workingHourRepository,
        private readonly HolidayRepositoryInterface $holidayRepository,
        private readonly StaffRepositoryInterface $staffRepository,
        private readonly ScheduleRepositoryInterface $scheduleRepository,
        private readonly LeaveRepositoryInterface $leaveRepository,
        private readonly RoomRepositoryInterface $roomRepository,
        private readonly TenantSettingService $settingService,
    ) {}

    public function getTenantId(): string
    {
        return tenant()->getTenantKey();
    }

    public function getAvailableSlots(string $date, string $serviceId, int $duration, ?string $branchId = null, ?string $staffId = null, ?string $customerId = null): array
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

        $staffCollection = $this->getAvailableStaff($tenantId, $date, $dayOfWeek, $branchId, $staffId, $serviceId, $customerId);
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
            $dayWh->break_start instanceof \Carbon\CarbonImmutable ? $dayWh->break_start->format('H:i') : $dayWh->break_start,
            $dayWh->break_end instanceof \Carbon\CarbonImmutable ? $dayWh->break_end->format('H:i') : $dayWh->break_end,
        );

        return [
            'date' => $date,
            'available' => ! empty($slots),
            'slots' => $slots,
        ];
    }

    private function getAvailableStaff(string $tenantId, string $date, int $dayOfWeek, ?string $branchId = null, ?string $staffId = null, ?string $serviceId = null, ?string $customerId = null): Collection
    {
        $allStaff = $this->staffRepository->findAllByTenant($tenantId);

        if ($branchId !== null) {
            $allStaff = $allStaff->where('branch_id', $branchId);
        }

        if ($staffId !== null) {
            $allStaff = $allStaff->where('id', $staffId);
        }

        // Filter staff by service capability
        if ($serviceId !== null) {
            $service = Service::with('staff')->find($serviceId);
            if ($service && $service->staff->isNotEmpty()) {
                $capableStaffIds = $service->staff->pluck('id')->toArray();
                $allStaff = $allStaff->whereIn('id', $capableStaffIds);
            }
        }

        // Filter by shift assignment (staff must have a shift on this date)
        $shiftStaffIds = StaffShiftAssignment::where('tenant_id', $tenantId)
            ->where('date', $date)
            ->pluck('staff_id')
            ->toArray();

        if (! empty($shiftStaffIds)) {
            $allStaff = $allStaff->whereIn('id', $shiftStaffIds);
        }

        $schedules = $this->scheduleRepository->findByTenant($tenantId);

        // Load customer preferences if customerId provided
        $preferences = $customerId ? CustomerStaffPreference::where('tenant_id', $tenantId)->where('customer_id', $customerId)->get() : collect();

        $blockedStaffIds = $preferences->where('preference_type', 'blocked')->flatMap(fn ($p) => $p->blocked_staff_ids ?? [])->toArray();
        $preferredStaffId = $preferences->where('preference_type', 'preferred')->first()?->staff_id;
        $genderPreference = $preferences->where('preference_type', 'gender')->first()?->gender;

        $filtered = $allStaff->filter(function ($staff) use ($tenantId, $date, $dayOfWeek, $schedules, $blockedStaffIds) {
            if (in_array($staff->id, $blockedStaffIds)) {
                return false;
            }

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

        // Apply gender filter if preference set
        if ($genderPreference && in_array($genderPreference, ['male', 'female'])) {
            $genderFiltered = $filtered->filter(fn ($s) => strtolower($s->position ?? '') === $genderPreference);
            if ($genderFiltered->isNotEmpty()) {
                $filtered = $genderFiltered->values();
            }
        }

        // Sort: preferred staff first
        if ($preferredStaffId) {
            $filtered = $filtered->sortBy(fn ($s) => $s->id === $preferredStaffId ? 0 : 1)->values();
        }

        return $filtered;
    }

    public function getAvailableRooms(string $date, string $startTime, string $endTime, ?string $branchId = null, ?string $excludeBookingId = null): array
    {
        $tenantId = $this->getTenantId();
        $rooms = $this->roomRepository->findAllByTenant($tenantId, $branchId);

        return $rooms->filter(function (Room $room) use ($tenantId, $startTime, $endTime, $excludeBookingId) {
            $overlaps = $this->roomRepository->getOverlappingBookings(
                $tenantId,
                $room->id,
                $startTime,
                $endTime,
                $excludeBookingId,
            );

            return $overlaps->isEmpty();
        })->values()->toArray();
    }

    private function generateTimeSlots(string $tenantId, string $date, string $openTime, string $closeTime, int $duration, Collection $staffList, ?string $breakStart = null, ?string $breakEnd = null): array
    {
        $open = strtotime("$date $openTime");
        $close = strtotime("$date $closeTime");
        $interval = (int) $this->settingService->get('booking.slot_interval', 30);
        $slots = [];

        $breakStartTs = $breakStart ? strtotime("$date $breakStart") : null;
        $breakEndTs = $breakEnd ? strtotime("$date $breakEnd") : null;

        for ($time = $open; $time + ($duration * 60) <= $close; $time += $interval * 60) {
            $startSlot = date('Y-m-d H:i:s', $time);
            $endSlot = date('Y-m-d H:i:s', $time + ($duration * 60));

            if ($breakStartTs !== null && $breakEndTs !== null) {
                $slotStart = $time;
                $slotEnd = $time + ($duration * 60);

                if ($slotStart < $breakEndTs && $slotEnd > $breakStartTs) {
                    continue;
                }
            }

            $availableStaff = $staffList->filter(function ($staff) use ($tenantId, $startSlot, $endSlot) {
                $overlaps = $this->bookingRepository->getOverlappingBookings(
                    $tenantId,
                    $staff->id,
                    $startSlot,
                    $endSlot,
                );

                return $overlaps->isEmpty();
            })->values();

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
