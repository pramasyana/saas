<?php

declare(strict_types=1);

namespace App\Modules\Staff\Services;

use App\Modules\Staff\Contracts\ShiftAssignmentRepositoryInterface;
use Illuminate\Support\Facades\DB;

class ShiftAssignmentService
{
    public function __construct(
        private readonly ShiftAssignmentRepositoryInterface $repository,
    ) {}

    public function getTenantId(): string
    {
        return auth()->user()->tenant_id;
    }

    public function getCalendarData(string $startDate, string $endDate, ?string $branchId = null): array
    {
        $tenantId = $this->getTenantId();

        $assignments = $this->repository->findByTenantAndDateRange($tenantId, $startDate, $endDate);

        if ($branchId) {
            $assignments = $assignments->filter(fn ($a) => $a->staff?->branch_id === $branchId);
        }

        $grouped = $assignments->groupBy(fn ($a) => $a->staff_id)
            ->map(function ($staffAssignments, $staffId) {
                $staff = $staffAssignments->first()->staff;

                return [
                    'staff_id' => $staffId,
                    'staff_name' => $staff?->name ?? 'Unknown',
                    'branch_id' => $staff?->branch_id,
                    'shifts' => $staffAssignments->map(fn ($a) => [
                        'id' => $a->id,
                        'date' => $a->date->format('Y-m-d'),
                        'start_time' => $a->start_time,
                        'end_time' => $a->end_time,
                        'notes' => $a->notes,
                    ])->values(),
                ];
            })
            ->values();

        return [
            'start_date' => $startDate,
            'end_date' => $endDate,
            'assignments' => $grouped,
        ];
    }

    public function bulkAssign(array $assignments): array
    {
        $tenantId = $this->getTenantId();
        $created = 0;

        DB::transaction(function () use ($assignments, $tenantId, &$created) {
            foreach ($assignments as $item) {
                $existing = \App\Modules\Staff\Models\StaffShiftAssignment::where('tenant_id', $tenantId)
                    ->where('staff_id', $item['staff_id'])
                    ->where('date', $item['date'])
                    ->first();

                if ($existing) {
                    $existing->update([
                        'start_time' => $item['start_time'],
                        'end_time' => $item['end_time'],
                        'notes' => $item['notes'] ?? null,
                    ]);
                } else {
                    $this->repository->create([
                        'tenant_id' => $tenantId,
                        'staff_id' => $item['staff_id'],
                        'date' => $item['date'],
                        'start_time' => $item['start_time'],
                        'end_time' => $item['end_time'],
                        'notes' => $item['notes'] ?? null,
                    ]);
                    $created++;
                }
            }
        });

        return ['created' => $created, 'total' => count($assignments)];
    }

    public function remove(string $staffId, string $date): void
    {
        $this->repository->deleteByStaffAndDate($this->getTenantId(), $staffId, $date);
    }

    public function bulkRemove(array $items): int
    {
        $tenantId = $this->getTenantId();
        $deleted = 0;

        foreach ($items as $item) {
            $deleted += $this->repository->deleteByStaffAndDate($tenantId, $item['staff_id'], $item['date']) ? 1 : 0;
        }

        return $deleted;
    }
}
