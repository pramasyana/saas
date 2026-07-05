<?php

declare(strict_types=1);

namespace App\Modules\Booking\Services;

use App\Modules\Booking\Actions\ConfirmBookingAction;
use App\Modules\Booking\Actions\CreateBookingAction;
use App\Modules\Booking\Actions\NoShowAction;
use App\Modules\Booking\Actions\RescheduleBookingAction;
use App\Modules\Booking\Actions\WalkInAction;
use App\Modules\Booking\Contracts\BookingRepositoryInterface;
use App\Modules\Booking\Contracts\BookingStatusLogRepositoryInterface;
use App\Modules\Booking\Events\BookingCancelled;
use App\Modules\Booking\Events\BookingCheckedIn;
use App\Modules\Booking\Events\BookingCompleted;
use App\Modules\Booking\Models\Booking;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class BookingService
{
    public function __construct(
        private readonly BookingRepositoryInterface $bookingRepository,
        private readonly BookingStatusLogRepositoryInterface $statusLogRepository,
        private readonly CreateBookingAction $createBookingAction,
        private readonly RescheduleBookingAction $rescheduleBookingAction,
        private readonly NoShowAction $noShowAction,
        private readonly WalkInAction $walkInAction,
        private readonly ConfirmBookingAction $confirmBookingAction,
    ) {}

    public function getTenantId(): string
    {
        return auth()->user()->tenant_id;
    }

    public function paginate(array $filters = [], ?string $branchId = null, int $perPage = 15): LengthAwarePaginator
    {
        return $this->bookingRepository->paginate($this->getTenantId(), $filters, $branchId, $perPage);
    }

    public function findById(string $id): Booking
    {
        return $this->bookingRepository->findOrFail($id);
    }

    public function create(array $data): Booking
    {
        return $this->createBookingAction->execute($data, $this->getTenantId());
    }

    public function update(string $id, array $data): Booking
    {
        return DB::transaction(function () use ($id, $data) {
            $booking = $this->bookingRepository->findOrFail($id);

            return $this->bookingRepository->update($booking, $data);
        });
    }

    public function delete(string $id): void
    {
        DB::transaction(function () use ($id) {
            $booking = $this->bookingRepository->findOrFail($id);
            $this->bookingRepository->delete($booking);
        });
    }

    public function reschedule(string $id, array $newSchedule): Booking
    {
        return $this->rescheduleBookingAction->execute($id, $newSchedule);
    }

    public function markNoShow(string $id): Booking
    {
        return $this->noShowAction->execute($id);
    }

    public function checkIn(string $id): Booking
    {
        return DB::transaction(function () use ($id) {
            $booking = $this->bookingRepository->findOrFail($id);
            $this->bookingRepository->update($booking, ['status' => 'in_progress']);

            $this->statusLogRepository->create([
                'booking_id' => $booking->id,
                'from_status' => $booking->status,
                'to_status' => 'in_progress',
                'changed_by' => auth()->id() ?? 'system',
            ]);

            event(new BookingCheckedIn($booking));

            return $booking->fresh(['customer', 'staff']);
        });
    }

    public function complete(string $id): Booking
    {
        return DB::transaction(function () use ($id) {
            $booking = $this->bookingRepository->findOrFail($id);
            $this->bookingRepository->update($booking, ['status' => 'completed']);

            $this->statusLogRepository->create([
                'booking_id' => $booking->id,
                'from_status' => $booking->status,
                'to_status' => 'completed',
                'changed_by' => auth()->id() ?? 'system',
            ]);

            event(new BookingCompleted($booking));

            return $booking->fresh(['customer', 'staff']);
        });
    }

    public function cancel(string $id): Booking
    {
        return DB::transaction(function () use ($id) {
            $booking = $this->bookingRepository->findOrFail($id);
            $this->bookingRepository->update($booking, ['status' => 'cancelled']);

            $this->statusLogRepository->create([
                'booking_id' => $booking->id,
                'from_status' => $booking->status,
                'to_status' => 'cancelled',
                'changed_by' => auth()->id() ?? 'system',
            ]);

            event(new BookingCancelled($booking));

            return $booking->fresh(['customer', 'staff']);
        });
    }

    public function confirm(string $id): Booking
    {
        return $this->confirmBookingAction->execute($id);
    }

    public function walkIn(array $data): Booking
    {
        return $this->walkInAction->execute($data, $this->getTenantId());
    }

    public function getCalendarEvents(string $startDate, string $endDate, ?string $branchId = null, ?string $staffId = null): Collection
    {
        return $this->bookingRepository->getCalendarEvents(
            $this->getTenantId(),
            $startDate,
            $endDate,
            $branchId,
            $staffId,
        );
    }

    public function getStats(): array
    {
        $tenantId = $this->getTenantId();

        return [
            'total' => $this->bookingRepository->countByTenant($tenantId),
            'confirmed' => $this->bookingRepository->countByStatus($tenantId, 'confirmed'),
            'in_progress' => $this->bookingRepository->countByStatus($tenantId, 'in_progress'),
            'completed' => $this->bookingRepository->countByStatus($tenantId, 'completed'),
            'cancelled' => $this->bookingRepository->countByStatus($tenantId, 'cancelled'),
            'no_show' => $this->bookingRepository->countByStatus($tenantId, 'no_show'),
        ];
    }

    public function getAnalytics(): array
    {
        $tenantId = $this->getTenantId();
        $today = now()->format('Y-m-d');
        $weekAgo = now()->subDays(6)->format('Y-m-d');
        $monthStart = now()->startOfMonth()->format('Y-m-d');
        $monthEnd = now()->endOfMonth()->format('Y-m-d');

        $dailyCounts = $this->bookingRepository->getDailyBookingCounts($tenantId, 7);
        $chartData = [];

        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $dayLabel = now()->subDays($i)->isoFormat('dd');
            $chartData[] = [
                'day' => $dayLabel,
                'date' => $date,
                'count' => (int) ($dailyCounts[$date]->count ?? 0),
            ];
        }

        $revenueMonth = $this->bookingRepository->getRevenueByDateRange($tenantId, $monthStart, $monthEnd);
        $revenueWeek = $this->bookingRepository->getRevenueByDateRange($tenantId, $weekAgo, $today);
        $topServices = $this->bookingRepository->getTopServices($tenantId, 5, $monthStart, $monthEnd);
        $staffPerformance = $this->bookingRepository->getStaffPerformance($tenantId, $monthStart, $monthEnd);

        return [
            'booking_chart' => $chartData,
            'revenue_month' => $revenueMonth,
            'revenue_week' => $revenueWeek,
            'top_services' => $topServices,
            'staff_performance' => $staffPerformance,
        ];
    }
}
