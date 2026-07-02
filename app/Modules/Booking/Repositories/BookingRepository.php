<?php

declare(strict_types=1);

namespace App\Modules\Booking\Repositories;

use App\Modules\Booking\Contracts\BookingRepositoryInterface;
use App\Modules\Booking\Models\Booking;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class BookingRepository implements BookingRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], ?string $branchId = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = Booking::where('tenant_id', $tenantId);

        if ($branchId !== null) {
            $query->where('branch_id', $branchId);
        }

        if (! empty($filters['search'])) {
            $query->where(function ($q) use ($filters): void {
                $q->whereHas('customer', function ($cq) use ($filters): void {
                    $cq->where('name', 'like', "%{$filters['search']}%");
                });
            });
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['date'])) {
            $query->whereDate('start_time', $filters['date']);
        }

        if (! empty($filters['staff_id'])) {
            $query->where('staff_id', $filters['staff_id']);
        }

        if (! empty($filters['source'])) {
            $query->where('source', $filters['source']);
        }

        return $query->with(['customer', 'staff', 'branch', 'services'])
            ->orderBy('start_time', 'desc')
            ->paginate($perPage);
    }

    public function findById(string $id): ?Booking
    {
        return Booking::with(['customer', 'staff', 'branch', 'services.addons'])->find($id);
    }

    public function findOrFail(string $id): Booking
    {
        return Booking::with(['customer', 'staff', 'branch', 'services.addons'])->findOrFail($id);
    }

    public function create(array $data): Booking
    {
        return Booking::create($data);
    }

    public function update(Booking $booking, array $data): Booking
    {
        $booking->update($data);

        return $booking;
    }

    public function delete(Booking $booking): bool
    {
        return $booking->delete();
    }

    public function countByTenant(string $tenantId): int
    {
        return Booking::where('tenant_id', $tenantId)->count();
    }

    public function getCalendarEvents(string $tenantId, string $startDate, string $endDate, ?string $branchId = null, ?string $staffId = null): Collection
    {
        $query = Booking::where('tenant_id', $tenantId)
            ->where('start_time', '>=', $startDate)
            ->where('end_time', '<=', $endDate)
            ->whereNotIn('status', ['cancelled']);

        if ($branchId !== null) {
            $query->where('branch_id', $branchId);
        }

        if ($staffId !== null) {
            $query->where('staff_id', $staffId);
        }

        return $query->with(['customer:id,name,phone', 'staff:id,name', 'services'])
            ->orderBy('start_time')
            ->get();
    }

    public function getOverlappingBookings(string $tenantId, string $staffId, string $startTime, string $endTime, ?string $excludeId = null): Collection
    {
        $query = Booking::where('tenant_id', $tenantId)
            ->where('staff_id', $staffId)
            ->where('start_time', '<', $endTime)
            ->where('end_time', '>', $startTime)
            ->whereNotIn('status', ['cancelled', 'no_show']);

        if ($excludeId !== null) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->get();
    }

    public function countByStatus(string $tenantId, string $status): int
    {
        return Booking::where('tenant_id', $tenantId)->where('status', $status)->count();
    }
}
