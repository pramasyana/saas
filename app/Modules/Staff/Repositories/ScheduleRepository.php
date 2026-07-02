<?php

declare(strict_types=1);

namespace App\Modules\Staff\Repositories;

use App\Modules\Staff\Contracts\ScheduleRepositoryInterface;
use App\Modules\Staff\Models\StaffSchedule;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ScheduleRepository implements ScheduleRepositoryInterface
{
    public function findByStaff(string $tenantId, string $staffId): Collection
    {
        return StaffSchedule::where('tenant_id', $tenantId)
            ->where('staff_id', $staffId)
            ->orderBy('day_of_week')
            ->get();
    }

    public function findByTenant(string $tenantId): Collection
    {
        return StaffSchedule::where('tenant_id', $tenantId)
            ->orderBy('staff_id')
            ->orderBy('day_of_week')
            ->get();
    }

    public function updateOrCreate(string $tenantId, string $staffId, int $dayOfWeek, array $data): StaffSchedule
    {
        return StaffSchedule::updateOrCreate(
            [
                'tenant_id' => $tenantId,
                'staff_id' => $staffId,
                'day_of_week' => $dayOfWeek,
            ],
            $data,
        );
    }

    public function deleteByStaff(string $tenantId, string $staffId): void
    {
        StaffSchedule::where('tenant_id', $tenantId)
            ->where('staff_id', $staffId)
            ->delete();
    }

    public function bulkUpdate(string $tenantId, string $staffId, array $schedules): void
    {
        DB::transaction(function () use ($tenantId, $staffId, $schedules): void {
            $this->deleteByStaff($tenantId, $staffId);

            foreach ($schedules as $schedule) {
                StaffSchedule::create([
                    'tenant_id' => $tenantId,
                    'staff_id' => $staffId,
                    'day_of_week' => $schedule['day_of_week'],
                    'start_time' => $schedule['start_time'] ?? null,
                    'end_time' => $schedule['end_time'] ?? null,
                    'is_active' => $schedule['is_active'] ?? true,
                ]);
            }
        });
    }
}
