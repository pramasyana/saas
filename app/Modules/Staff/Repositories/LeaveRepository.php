<?php

declare(strict_types=1);

namespace App\Modules\Staff\Repositories;

use App\Modules\Staff\Contracts\LeaveRepositoryInterface;
use App\Modules\Staff\Models\Leave;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class LeaveRepository implements LeaveRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Leave::where('tenant_id', $tenantId)->with('staff');

        if (! empty($filters['staff_id'])) {
            $query->where('staff_id', $filters['staff_id']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (! empty($filters['date_from'])) {
            $query->where('date_start', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->where('date_end', '<=', $filters['date_to']);
        }

        return $query->orderByDesc('created_at')->paginate($perPage);
    }

    public function findById(string $id): ?Leave
    {
        return Leave::with('staff', 'approver')->find($id);
    }

    public function findOrFail(string $id): Leave
    {
        return Leave::with('staff', 'approver')->findOrFail($id);
    }

    public function create(array $data): Leave
    {
        return Leave::create($data);
    }

    public function update(Leave $leave, array $data): Leave
    {
        $leave->update($data);

        return $leave;
    }

    public function delete(Leave $leave): bool
    {
        return $leave->delete();
    }

    public function countByTenant(string $tenantId): int
    {
        return Leave::where('tenant_id', $tenantId)->count();
    }

    public function countByStatus(string $tenantId, string $status): int
    {
        return Leave::where('tenant_id', $tenantId)->where('status', $status)->count();
    }

    public function countByStaffAndDateRange(string $tenantId, string $staffId, string $start, string $end): int
    {
        return Leave::where('tenant_id', $tenantId)
            ->where('staff_id', $staffId)
            ->where('status', 'approved')
            ->where(function ($q) use ($start, $end): void {
                $q->whereBetween('date_start', [$start, $end])
                    ->orWhereBetween('date_end', [$start, $end])
                    ->orWhere(function ($q2) use ($start, $end): void {
                        $q2->where('date_start', '<=', $start)
                            ->where('date_end', '>=', $end);
                    });
            })
            ->count();
    }
}
