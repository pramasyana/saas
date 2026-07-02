<?php

declare(strict_types=1);

namespace App\Modules\Booking\Listeners;

use App\Modules\Booking\Contracts\BookingRepositoryInterface;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Cache;

class UpdateDashboardStats implements ShouldQueue
{
    public function __construct(
        private readonly BookingRepositoryInterface $bookingRepository,
    ) {}

    public function handle(object $event): void
    {
        $booking = $event->booking;

        if (! $booking || ! $booking->tenant_id) {
            return;
        }

        $tenantId = $booking->tenant_id;
        $cacheKey = "booking_stats_{$tenantId}";

        $stats = [
            'total' => $this->bookingRepository->countByTenant($tenantId),
            'confirmed' => $this->bookingRepository->countByStatus($tenantId, 'confirmed'),
            'in_progress' => $this->bookingRepository->countByStatus($tenantId, 'in_progress'),
            'completed' => $this->bookingRepository->countByStatus($tenantId, 'completed'),
            'cancelled' => $this->bookingRepository->countByStatus($tenantId, 'cancelled'),
            'no_show' => $this->bookingRepository->countByStatus($tenantId, 'no_show'),
        ];

        Cache::put($cacheKey, $stats, now()->addMinutes(5));
    }
}
