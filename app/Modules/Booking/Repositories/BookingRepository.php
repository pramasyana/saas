<?php

declare(strict_types=1);

namespace App\Modules\Booking\Repositories;

use App\Modules\Booking\Contracts\BookingRepositoryInterface;
use App\Modules\Booking\Models\Booking;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

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

        if (! empty($filters['customer_id'])) {
            $query->where('customer_id', $filters['customer_id']);
        }

        return $query->with(['customer', 'staff', 'branch', 'services.addons', 'rooms', 'participants'])
            ->orderBy('start_time', 'desc')
            ->paginate($perPage);
    }

    public function findById(string $id): ?Booking
    {
        return Booking::with(['customer', 'staff', 'branch', 'services.addons', 'rooms', 'participants'])->find($id);
    }

    public function findOrFail(string $id): Booking
    {
        return Booking::with(['customer', 'staff', 'branch', 'services.addons', 'rooms', 'participants', 'reminders', 'statusLogs.changedByUser'])->findOrFail($id);
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

        return $query->with(['customer:id,name,phone', 'staff:id,name', 'services', 'rooms', 'participants'])
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

    public function getDailyBookingCounts(string $tenantId, int $days = 7): Collection
    {
        $startDate = now()->subDays($days - 1)->startOfDay();

        return Booking::where('tenant_id', $tenantId)
            ->where('start_time', '>=', $startDate)
            ->whereNotIn('status', ['cancelled', 'no_show'])
            ->select(DB::raw('DATE(start_time) as date'), DB::raw('COUNT(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');
    }

    public function getRevenueByDateRange(string $tenantId, string $startDate, string $endDate): float
    {
        return (float) DB::table('bookings')
            ->join('booking_services', 'bookings.id', '=', 'booking_services.booking_id')
            ->where('bookings.tenant_id', $tenantId)
            ->whereIn('bookings.status', ['completed', 'in_progress'])
            ->where('bookings.start_time', '>=', $startDate)
            ->where('bookings.start_time', '<=', $endDate)
            ->select(DB::raw('COALESCE(SUM(booking_services.price * booking_services.quantity), 0) as total'))
            ->value('total');
    }

    public function getTopServices(string $tenantId, int $limit = 5, ?string $startDate = null, ?string $endDate = null): Collection
    {
        $query = DB::table('bookings')
            ->join('booking_services', 'bookings.id', '=', 'booking_services.booking_id')
            ->where('bookings.tenant_id', $tenantId)
            ->whereIn('bookings.status', ['completed', 'confirmed', 'in_progress']);

        if ($startDate) {
            $query->where('bookings.start_time', '>=', $startDate);
        }

        if ($endDate) {
            $query->where('bookings.start_time', '<=', $endDate);
        }

        return $query->select(
            'booking_services.name',
            DB::raw('COUNT(*) as total_bookings'),
            DB::raw('COALESCE(SUM(booking_services.price * booking_services.quantity), 0) as total_revenue'),
        )
            ->groupBy('booking_services.name')
            ->orderByDesc('total_revenue')
            ->limit($limit)
            ->get();
    }

    public function getStaffPerformance(string $tenantId, ?string $startDate = null, ?string $endDate = null): Collection
    {
        $query = Booking::where('bookings.tenant_id', $tenantId)
            ->whereIn('bookings.status', ['completed', 'confirmed', 'in_progress'])
            ->join('staff', 'bookings.staff_id', '=', 'staff.id')
            ->leftJoin('booking_services', 'bookings.id', '=', 'booking_services.booking_id');

        if ($startDate) {
            $query->where('bookings.start_time', '>=', $startDate);
        }

        if ($endDate) {
            $query->where('bookings.start_time', '<=', $endDate);
        }

        return $query->select(
            'staff.id',
            'staff.name',
            DB::raw('COUNT(DISTINCT bookings.id) as total_bookings'),
            DB::raw('COALESCE(SUM(booking_services.price * booking_services.quantity), 0) as total_revenue'),
        )
            ->groupBy('staff.id', 'staff.name')
            ->orderByDesc('total_bookings')
            ->get();
    }

    public function countByDateRange(string $tenantId, string $startDate, string $endDate, ?string $status = null): int
    {
        $query = Booking::where('tenant_id', $tenantId)
            ->where('start_time', '>=', $startDate)
            ->where('start_time', '<=', $endDate);

        if ($status !== null) {
            $query->where('status', $status);
        }

        return $query->count();
    }

    public function getUrgentBookings(string $tenantId, int $minutes = 60, int $limit = 10): Collection
    {
        return Booking::where('tenant_id', $tenantId)
            ->where('start_time', '>=', now())
            ->where('start_time', '<=', now()->addMinutes($minutes))
            ->whereIn('status', ['pending', 'confirmed'])
            ->with(['customer:id,name,phone', 'staff:id,name', 'services'])
            ->orderBy('start_time')
            ->limit($limit)
            ->get();
    }

    public function getLatestBookings(string $tenantId, int $limit = 5): Collection
    {
        return Booking::where('tenant_id', $tenantId)
            ->with(['customer:id,name', 'services'])
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getTodayBookings(string $tenantId, int $limit = 10): Collection
    {
        return Booking::where('tenant_id', $tenantId)
            ->whereDate('start_time', today())
            ->with(['customer:id,name', 'staff:id,name', 'services'])
            ->orderBy('start_time')
            ->limit($limit)
            ->get();
    }
}
