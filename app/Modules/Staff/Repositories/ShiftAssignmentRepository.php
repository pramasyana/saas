<?php

declare(strict_types=1);

namespace App\Modules\Staff\Repositories;

use App\Modules\Staff\Contracts\ShiftAssignmentRepositoryInterface;
use App\Modules\Staff\Models\StaffShiftAssignment;
use Illuminate\Support\Collection;

class ShiftAssignmentRepository implements ShiftAssignmentRepositoryInterface
{
    public function findByTenantAndDateRange(string $tenantId, string $startDate, string $endDate): Collection
    {
        return StaffShiftAssignment::where('tenant_id', $tenantId)
            ->whereBetween('date', [$startDate, $endDate])
            ->with('staff:id,name,branch_id')
            ->get();
    }

    public function findByStaffAndDateRange(string $tenantId, string $staffId, string $startDate, string $endDate): Collection
    {
        return StaffShiftAssignment::where('tenant_id', $tenantId)
            ->where('staff_id', $staffId)
            ->whereBetween('date', [$startDate, $endDate])
            ->get();
    }

    public function create(array $data): StaffShiftAssignment
    {
        return StaffShiftAssignment::create($data);
    }

    public function deleteByStaffAndDate(string $tenantId, string $staffId, string $date): bool
    {
        return (bool) StaffShiftAssignment::where('tenant_id', $tenantId)
            ->where('staff_id', $staffId)
            ->where('date', $date)
            ->delete();
    }

    public function deleteByTenantAndDateRange(string $tenantId, string $startDate, string $endDate): int
    {
        return StaffShiftAssignment::where('tenant_id', $tenantId)
            ->whereBetween('date', [$startDate, $endDate])
            ->delete();
    }
}
