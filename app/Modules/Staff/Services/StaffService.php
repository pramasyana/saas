<?php

declare(strict_types=1);

namespace App\Modules\Staff\Services;

use App\Modules\Staff\Contracts\AttendanceRepositoryInterface;
use App\Modules\Staff\Contracts\CommissionRepositoryInterface;
use App\Modules\Staff\Contracts\LeaveRepositoryInterface;
use App\Modules\Staff\Contracts\ScheduleRepositoryInterface;
use App\Modules\Staff\Contracts\StaffRepositoryInterface;
use App\Modules\Staff\Models\Attendance;
use App\Modules\Staff\Models\Commission;
use App\Modules\Staff\Models\Leave;
use App\Modules\Staff\Models\Staff;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class StaffService
{
    public function __construct(
        private readonly StaffRepositoryInterface $staffRepository,
        private readonly ScheduleRepositoryInterface $scheduleRepository,
        private readonly AttendanceRepositoryInterface $attendanceRepository,
        private readonly LeaveRepositoryInterface $leaveRepository,
        private readonly CommissionRepositoryInterface $commissionRepository,
    ) {}

    public function getTenantId(): string
    {
        return auth()->user()->tenant_id;
    }

    // ── Staff CRUD ──

    public function paginateStaff(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->staffRepository->paginate($this->getTenantId(), $filters, $perPage);
    }

    public function getAllStaff(): Collection
    {
        return $this->staffRepository->findAllByTenant($this->getTenantId());
    }

    public function getStaff(string $id): Staff
    {
        return $this->staffRepository->findOrFail($id);
    }

    public function createStaff(array $data): Staff
    {
        return DB::transaction(function () use ($data) {
            return $this->staffRepository->create(array_merge($data, [
                'tenant_id' => $this->getTenantId(),
            ]));
        });
    }

    public function updateStaff(string $id, array $data): Staff
    {
        return DB::transaction(function () use ($id, $data) {
            $staff = $this->staffRepository->findOrFail($id);

            return $this->staffRepository->update($staff, $data);
        });
    }

    public function deleteStaff(string $id): void
    {
        DB::transaction(function () use ($id) {
            $staff = $this->staffRepository->findOrFail($id);
            $this->staffRepository->delete($staff);
        });
    }

    public function findById(string $id): Staff
    {
        return $this->staffRepository->findOrFail($id);
    }

    public function getAttendanceById(string $id): Attendance
    {
        $attendance = $this->attendanceRepository->findById($id);
        if (! $attendance) {
            throw new \RuntimeException('Attendance not found');
        }

        return $attendance;
    }

    public function getCommissionById(string $id): Commission
    {
        $commission = $this->commissionRepository->findById($id);
        if (! $commission) {
            throw new \RuntimeException('Commission not found');
        }

        return $commission;
    }

    public function getStaffStats(): array
    {
        $tenantId = $this->getTenantId();

        return [
            'total' => $this->staffRepository->countByTenant($tenantId),
            'active' => $this->staffRepository->countActiveByTenant($tenantId),
        ];
    }

    // ── Schedule ──

    public function getSchedules(string $staffId): Collection
    {
        return $this->scheduleRepository->findByStaff($this->getTenantId(), $staffId);
    }

    public function updateSchedules(string $staffId, array $schedules): void
    {
        DB::transaction(function () use ($staffId, $schedules) {
            $this->scheduleRepository->bulkUpdate($this->getTenantId(), $staffId, $schedules);
        });
    }

    // ── Attendance ──

    public function paginateAttendance(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->attendanceRepository->paginate($this->getTenantId(), $filters, $perPage);
    }

    public function createAttendance(array $data): Attendance
    {
        return DB::transaction(function () use ($data) {
            return $this->attendanceRepository->create(array_merge($data, [
                'tenant_id' => $this->getTenantId(),
            ]));
        });
    }

    public function updateAttendance(string $id, array $data): Attendance
    {
        return DB::transaction(function () use ($id, $data) {
            $attendance = $this->attendanceRepository->findById($id);
            if (! $attendance) {
                throw new \RuntimeException('Attendance not found');
            }

            return $this->attendanceRepository->update($attendance, $data);
        });
    }

    public function deleteAttendance(string $id): void
    {
        DB::transaction(function () use ($id) {
            $attendance = $this->attendanceRepository->findById($id);
            if ($attendance) {
                $this->attendanceRepository->delete($attendance);
            }
        });
    }

    public function getAttendanceStats(?string $date = null): array
    {
        return $this->attendanceRepository->getStats($this->getTenantId(), $date);
    }

    // ── Leave ──

    public function paginateLeaves(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->leaveRepository->paginate($this->getTenantId(), $filters, $perPage);
    }

    public function createLeave(array $data): Leave
    {
        return DB::transaction(function () use ($data) {
            return $this->leaveRepository->create(array_merge($data, [
                'tenant_id' => $this->getTenantId(),
            ]));
        });
    }

    public function approveLeave(string $id, string $status): Leave
    {
        return DB::transaction(function () use ($id, $status) {
            $leave = $this->leaveRepository->findOrFail($id);

            return $this->leaveRepository->update($leave, [
                'status' => $status,
                'approved_by' => auth()->id(),
                'approved_at' => now(),
            ]);
        });
    }

    public function deleteLeave(string $id): void
    {
        DB::transaction(function () use ($id) {
            $leave = $this->leaveRepository->findOrFail($id);
            $this->leaveRepository->delete($leave);
        });
    }

    public function getLeaveStats(): array
    {
        $tenantId = $this->getTenantId();

        return [
            'total' => $this->leaveRepository->countByTenant($tenantId),
            'pending' => $this->leaveRepository->countByStatus($tenantId, 'pending'),
            'approved' => $this->leaveRepository->countByStatus($tenantId, 'approved'),
            'rejected' => $this->leaveRepository->countByStatus($tenantId, 'rejected'),
        ];
    }

    // ── Commission ──

    public function paginateCommissions(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->commissionRepository->paginate($this->getTenantId(), $filters, $perPage);
    }

    public function createCommission(array $data): Commission
    {
        return DB::transaction(function () use ($data) {
            return $this->commissionRepository->create(array_merge($data, [
                'tenant_id' => $this->getTenantId(),
            ]));
        });
    }

    public function updateCommission(string $id, array $data): Commission
    {
        return DB::transaction(function () use ($id, $data) {
            $commission = $this->commissionRepository->findById($id);
            if (! $commission) {
                throw new \RuntimeException('Commission not found');
            }

            return $this->commissionRepository->update($commission, $data);
        });
    }

    public function deleteCommission(string $id): void
    {
        DB::transaction(function () use ($id) {
            $commission = $this->commissionRepository->findById($id);
            if ($commission) {
                $this->commissionRepository->delete($commission);
            }
        });
    }

    public function getCommissionStats(): array
    {
        $tenantId = $this->getTenantId();
        $monthStart = now()->startOfMonth()->format('Y-m-d');
        $monthEnd = now()->endOfMonth()->format('Y-m-d');
        $prevMonthStart = now()->subMonth()->startOfMonth()->format('Y-m-d');
        $prevMonthEnd = now()->subMonth()->endOfMonth()->format('Y-m-d');

        $totalMonth = $this->commissionRepository->totalByTenant($tenantId, $monthStart, $monthEnd);
        $prevTotalMonth = $this->commissionRepository->totalByTenant($tenantId, $prevMonthStart, $prevMonthEnd);
        $totalCount = $this->commissionRepository->countByTenant($tenantId, $monthStart, $monthEnd);
        $byType = $this->commissionRepository->totalByType($tenantId, $monthStart, $monthEnd);
        $topStaff = $this->commissionRepository->getTopStaff($tenantId, $monthStart, $monthEnd, 1);

        $topStaffName = null;
        $topStaffAmount = 0;
        if (! empty($topStaff)) {
            $staff = Staff::find($topStaff[0]['staff_id']);
            $topStaffName = $staff?->name;
            $topStaffAmount = (float) $topStaff[0]['total_amount'];
        }

        return [
            'total_month' => $totalMonth,
            'prev_total_month' => $prevTotalMonth,
            'total_count' => $totalCount,
            'average_per_transaction' => $totalCount > 0 ? $totalMonth / $totalCount : 0,
            'by_type' => [
                'service' => [
                    'amount' => (float) ($byType['service']['total_amount'] ?? 0),
                    'count' => (int) ($byType['service']['total_count'] ?? 0),
                ],
                'product' => [
                    'amount' => (float) ($byType['product']['total_amount'] ?? 0),
                    'count' => (int) ($byType['product']['total_count'] ?? 0),
                ],
                'bonus' => [
                    'amount' => (float) ($byType['bonus']['total_amount'] ?? 0),
                    'count' => (int) ($byType['bonus']['total_count'] ?? 0),
                ],
            ],
            'top_staff' => [
                'name' => $topStaffName,
                'amount' => $topStaffAmount,
            ],
        ];
    }
}
