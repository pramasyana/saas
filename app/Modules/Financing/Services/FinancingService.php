<?php

declare(strict_types=1);

namespace App\Modules\Financing\Services;

use App\Modules\Booking\Repositories\BookingRepository;
use App\Modules\Financing\Contracts\CostCategoryRepositoryInterface;
use App\Modules\Financing\Contracts\CostRepositoryInterface;
use App\Modules\Financing\Models\Cost;
use Carbon\CarbonImmutable;

class FinancingService
{
    public function __construct(
        private readonly CostRepositoryInterface $costRepository,
        private readonly CostCategoryRepositoryInterface $categoryRepository,
        private readonly BookingRepository $bookingRepository,
    ) {}

    public function getOverview(string $tenantId, ?string $startDate = null, ?string $endDate = null): array
    {
        $start = $startDate ?? CarbonImmutable::now()->startOfMonth()->toDateString();
        $end = $endDate ?? CarbonImmutable::now()->endOfMonth()->toDateString();

        $totalRevenue = $this->bookingRepository->getRevenueByDateRange($tenantId, $start, $end);
        $totalCost = $this->costRepository->sumByTenant($tenantId, $start, $end);
        $profit = $totalRevenue - $totalCost;
        $profitMargin = $totalRevenue > 0 ? round(($profit / $totalRevenue) * 100, 1) : 0;

        $totalCostAllTime = $this->costRepository->sumByTenant($tenantId, '2000-01-01', $end);
        $totalRevenueAllTime = $this->bookingRepository->getRevenueByDateRange($tenantId, '2000-01-01', $end);

        $currentMonthCost = $this->costRepository->sumByTenant($tenantId, CarbonImmutable::now()->startOfMonth()->toDateString(), CarbonImmutable::now()->endOfMonth()->toDateString());
        $prevMonthCost = $this->costRepository->sumByTenant($tenantId, CarbonImmutable::now()->subMonth()->startOfMonth()->toDateString(), CarbonImmutable::now()->subMonth()->endOfMonth()->toDateString());
        $costGrowth = $prevMonthCost > 0 ? round((($currentMonthCost - $prevMonthCost) / $prevMonthCost) * 100, 1) : 0;

        return [
            'total_revenue' => $totalRevenue,
            'total_cost' => $totalCost,
            'profit' => $profit,
            'profit_margin' => $profitMargin,
            'total_revenue_all_time' => $totalRevenueAllTime,
            'total_cost_all_time' => $totalCostAllTime,
            'cost_growth' => $costGrowth,
            'start_date' => $start,
            'end_date' => $end,
        ];
    }

    public function getMonthlyData(string $tenantId, int $months = 12): array
    {
        $start = CarbonImmutable::now()->subMonths($months - 1)->startOfMonth();

        $monthlyRevenue = [];
        $monthlyCost = [];

        for ($i = 0; $i < $months; $i++) {
            $date = $start->addMonthsNoOverflow($i);
            $monthStart = $date->startOfMonth()->toDateString();
            $monthEnd = $date->endOfMonth()->toDateString();
            $key = $date->format('Y-m');

            $monthlyRevenue[$key] = $this->bookingRepository->getRevenueByDateRange($tenantId, $monthStart, $monthEnd);
            $monthlyCost[$key] = $this->costRepository->sumByTenant($tenantId, $monthStart, $monthEnd);
        }

        $labels = [];
        $revenue = [];
        $costs = [];
        $profits = [];

        for ($i = 0; $i < $months; $i++) {
            $date = $start->addMonthsNoOverflow($i);
            $key = $date->format('Y-m');

            $labels[] = $date->isoFormat('MMM Y');
            $r = $monthlyRevenue[$key] ?? 0;
            $c = $monthlyCost[$key] ?? 0;
            $revenue[] = $r;
            $costs[] = $c;
            $profits[] = $r - $c;
        }

        return [
            'labels' => $labels,
            'revenue' => $revenue,
            'costs' => $costs,
            'profits' => $profits,
        ];
    }

    public function getCostBreakdown(string $tenantId, ?string $startDate = null, ?string $endDate = null): array
    {
        $start = $startDate ?? CarbonImmutable::now()->startOfMonth()->toDateString();
        $end = $endDate ?? CarbonImmutable::now()->endOfMonth()->toDateString();

        return $this->costRepository->sumByCategory($tenantId, $start, $end);
    }

    public function getStats(string $tenantId): array
    {
        $totalCategories = $this->categoryRepository->countByTenant($tenantId);
        $totalCosts = $this->costRepository->countByTenant($tenantId);
        $currentMonthCost = $this->costRepository->sumByTenant($tenantId, CarbonImmutable::now()->startOfMonth()->toDateString(), CarbonImmutable::now()->endOfMonth()->toDateString());
        $prevMonthCost = $this->costRepository->sumByTenant($tenantId, CarbonImmutable::now()->subMonth()->startOfMonth()->toDateString(), CarbonImmutable::now()->subMonth()->endOfMonth()->toDateString());

        return [
            'total_categories' => $totalCategories,
            'total_costs' => $totalCosts,
            'current_month_cost' => $currentMonthCost,
            'prev_month_cost' => $prevMonthCost,
        ];
    }

    public function importCosts(string $tenantId, string $createdBy, array $rows): int
    {
        $categories = $this->categoryRepository->findAllByTenant($tenantId)->keyBy('name');
        $records = [];

        foreach ($rows as $row) {
            $categoryName = $row['category'] ?? '';
            $category = $categories->get($categoryName);

            if (! $category) {
                continue;
            }

            $records[] = [
                'cost_category_id' => $category->id,
                'name' => $row['name'] ?? '',
                'amount' => (float) ($row['amount'] ?? 0),
                'date' => $row['date'] ?? now()->toDateString(),
                'notes' => $row['notes'] ?? null,
                'created_by' => $createdBy,
            ];
        }

        return $this->costRepository->bulkInsert($tenantId, $records);
    }
}
