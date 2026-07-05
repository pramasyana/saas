<?php

declare(strict_types=1);

namespace App\Modules\Booking\Contracts;

use App\Modules\Booking\Models\Booking;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface BookingRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], ?string $branchId = null, int $perPage = 15): LengthAwarePaginator;

    public function findById(string $id): ?Booking;

    public function findOrFail(string $id): Booking;

    public function create(array $data): Booking;

    public function update(Booking $booking, array $data): Booking;

    public function delete(Booking $booking): bool;

    public function countByTenant(string $tenantId): int;

    public function getCalendarEvents(string $tenantId, string $startDate, string $endDate, ?string $branchId = null, ?string $staffId = null): Collection;

    public function getOverlappingBookings(string $tenantId, string $staffId, string $startTime, string $endTime, ?string $excludeId = null): Collection;

    public function countByStatus(string $tenantId, string $status): int;

    public function getDailyBookingCounts(string $tenantId, int $days = 7): Collection;

    public function getRevenueByDateRange(string $tenantId, string $startDate, string $endDate): float;

    public function getTopServices(string $tenantId, int $limit = 5, ?string $startDate = null, ?string $endDate = null): Collection;

    public function getStaffPerformance(string $tenantId, ?string $startDate = null, ?string $endDate = null): Collection;

    public function countByDateRange(string $tenantId, string $startDate, string $endDate, ?string $status = null): int;

    public function getUrgentBookings(string $tenantId, int $minutes = 60, int $limit = 10): Collection;

    public function getLatestBookings(string $tenantId, int $limit = 5): Collection;

    public function getTodayBookings(string $tenantId, int $limit = 10): Collection;
}
