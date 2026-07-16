<?php

declare(strict_types=1);

namespace App\Modules\Staff\Contracts;

use App\Modules\Staff\Models\StaffShiftAssignment;
use Illuminate\Support\Collection;

interface ShiftAssignmentRepositoryInterface
{
    public function findByTenantAndDateRange(string $tenantId, string $startDate, string $endDate): Collection;

    public function findByStaffAndDateRange(string $tenantId, string $staffId, string $startDate, string $endDate): Collection;

    public function create(array $data): StaffShiftAssignment;

    public function deleteByStaffAndDate(string $tenantId, string $staffId, string $date): bool;

    public function deleteByTenantAndDateRange(string $tenantId, string $startDate, string $endDate): int;
}
