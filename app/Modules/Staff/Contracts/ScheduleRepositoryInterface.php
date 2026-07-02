<?php

declare(strict_types=1);

namespace App\Modules\Staff\Contracts;

use App\Modules\Staff\Models\StaffSchedule;
use Illuminate\Support\Collection;

interface ScheduleRepositoryInterface
{
    public function findByStaff(string $tenantId, string $staffId): Collection;

    public function findByTenant(string $tenantId): Collection;

    public function updateOrCreate(string $tenantId, string $staffId, int $dayOfWeek, array $data): StaffSchedule;

    public function deleteByStaff(string $tenantId, string $staffId): void;

    public function bulkUpdate(string $tenantId, string $staffId, array $schedules): void;
}
