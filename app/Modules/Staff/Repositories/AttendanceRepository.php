<?php

declare(strict_types=1);

namespace App\Modules\Staff\Repositories;

use App\Modules\Staff\Contracts\AttendanceRepositoryInterface;
use App\Modules\Staff\Models\Attendance;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AttendanceRepository implements AttendanceRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Attendance::where('tenant_id', $tenantId);

        if (!empty($filters['staff_id'])) {
            $query->where('staff_id', $filters['staff_id']);
        }

        if (!empty($filters['date'])) {
            $query->where('date', $filters['date']);
        }

        if (!empty($filters['date_from'])) {
            $query->where('date', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->where('date', '<=', $filters['date_to']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->with('staff')->orderByDesc('date')->orderByDesc('created_at')->paginate($perPage);
    }

    public function findById(string $id): ?Attendance
    {
        return Attendance::find($id);
    }

    public function findByStaffAndDate(string $tenantId, string $staffId, string $date): ?Attendance
    {
        return Attendance::where('tenant_id', $tenantId)
            ->where('staff_id', $staffId)
            ->where('date', $date)
            ->first();
    }

    public function create(array $data): Attendance
    {
        return Attendance::create($data);
    }

    public function update(Attendance $attendance, array $data): Attendance
    {
        $attendance->update($data);
        return $attendance;
    }

    public function delete(Attendance $attendance): bool
    {
        return $attendance->delete();
    }

    public function getStats(string $tenantId, ?string $date = null): array
    {
        $query = Attendance::where('tenant_id', $tenantId);

        if ($date) {
            $query->where('date', $date);
        }

        $total = (clone $query)->count();
        $present = (clone $query)->where('status', 'present')->count();
        $late = (clone $query)->where('status', 'late')->count();
        $absent = (clone $query)->where('status', 'absent')->count();

        return [
            'total' => $total,
            'present' => $present,
            'late' => $late,
            'absent' => $absent,
        ];
    }
}
