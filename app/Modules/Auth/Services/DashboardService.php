<?php

namespace App\Modules\Auth\Services;

use App\Models\User;
use App\Modules\Booking\Contracts\BookingRepositoryInterface;
use App\Modules\Crm\Contracts\CustomerRepositoryInterface;
use App\Modules\Crm\Contracts\CustomerSubscriptionRepositoryInterface;
use App\Modules\Subscription\Models\Subscription;

class DashboardService
{
    public function __construct(
        private readonly BookingRepositoryInterface $bookingRepository,
        private readonly CustomerRepositoryInterface $customerRepository,
        private readonly CustomerSubscriptionRepositoryInterface $subscriptionRepository,
    ) {}

    public function getStats(User $user): array
    {
        $subscription = Subscription::with('plan')
            ->where('user_id', $user->id)
            ->latest()
            ->first();

        $tenantId = $user->tenant_id;

        $monthStart = now()->startOfMonth()->format('Y-m-d');
        $today = now()->format('Y-m-d');
        $prevMonthStart = now()->subMonth()->startOfMonth()->format('Y-m-d');
        $prevMonthEnd = now()->subMonth()->endOfMonth()->format('Y-m-d');

        $monthlyRevenue = $this->bookingRepository->getRevenueByDateRange($tenantId, $monthStart, $today);
        $prevRevenue = $this->bookingRepository->getRevenueByDateRange($tenantId, $prevMonthStart, $prevMonthEnd);
        $revenueGrowth = $prevRevenue > 0 ? round(($monthlyRevenue - $prevRevenue) / $prevRevenue * 100, 1) : 0;

        $totalOrders = $this->bookingRepository->countByDateRange($tenantId, $monthStart, $today);
        $prevOrders = $this->bookingRepository->countByDateRange($tenantId, $prevMonthStart, $prevMonthEnd);
        $ordersGrowth = $prevOrders > 0 ? round(($totalOrders - $prevOrders) / $prevOrders * 100, 1) : 0;

        $avgOrderValue = $totalOrders > 0 ? $monthlyRevenue / $totalOrders : 0;
        $prevAvgOrderValue = $prevOrders > 0 ? $prevRevenue / $prevOrders : 0;
        $avgOrderGrowth = $prevAvgOrderValue > 0 ? round(($avgOrderValue - $prevAvgOrderValue) / $prevAvgOrderValue * 100, 1) : 0;

        $completed = $this->bookingRepository->countByDateRange($tenantId, $monthStart, $today, 'completed');
        $cancelled = $this->bookingRepository->countByDateRange($tenantId, $monthStart, $today, 'cancelled');
        $noShow = $this->bookingRepository->countByDateRange($tenantId, $monthStart, $today, 'no_show');
        $completable = $completed + $cancelled + $noShow;
        $completionRate = $completable > 0 ? round($completed / $completable * 100, 1) : 0;

        $prevCompleted = $this->bookingRepository->countByDateRange($tenantId, $prevMonthStart, $prevMonthEnd, 'completed');
        $prevCancelled = $this->bookingRepository->countByDateRange($tenantId, $prevMonthStart, $prevMonthEnd, 'cancelled');
        $prevNoShow = $this->bookingRepository->countByDateRange($tenantId, $prevMonthStart, $prevMonthEnd, 'no_show');
        $prevCompletable = $prevCompleted + $prevCancelled + $prevNoShow;
        $prevCompletionRate = $prevCompletable > 0 ? round($prevCompleted / $prevCompletable * 100, 1) : 0;
        $completionRateGrowth = $prevCompletionRate > 0 ? round($completionRate - $prevCompletionRate, 1) : 0;

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

        return [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'joined_at' => $user->created_at,
            ],
            'subscription' => $subscription ? [
                'plan_name' => $subscription->plan?->name,
                'plan_slug' => $subscription->plan?->slug,
                'status' => $subscription->status,
                'price_amount' => (float) $subscription->price_amount,
                'billing_interval' => $subscription->billing_interval,
                'starts_at' => $subscription->starts_at,
                'ends_at' => $subscription->ends_at,
                'features' => $subscription->features_snapshot,
            ] : null,
            'stats' => [
                'monthly_revenue' => $monthlyRevenue,
                'revenue_growth' => $revenueGrowth,
                'total_orders' => $totalOrders,
                'orders_growth' => $ordersGrowth,
                'avg_order_value' => round($avgOrderValue, 0),
                'avg_order_growth' => $avgOrderGrowth,
                'completion_rate' => $completionRate,
                'completion_rate_growth' => $completionRateGrowth,
                'active_customers' => $this->customerRepository->countActiveByTenant($tenantId),
                'active_subscriptions' => $this->subscriptionRepository->countActiveByTenant($tenantId),
            ],
            'urgent_bookings' => $this->bookingRepository->getUrgentBookings($tenantId, 60, 10),
            'booking_chart' => $chartData,
            'latest_bookings' => $this->bookingRepository->getLatestBookings($tenantId, 5),
            'top_services' => $this->bookingRepository->getTopServices($tenantId, 5, $monthStart, $today),
        ];
    }
}
