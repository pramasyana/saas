<?php

namespace App\Modules\Admin\Services;

use App\Modules\Subscription\Models\Invoice;
use App\Modules\Subscription\Models\Subscription;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;

class RevenueService
{
    public function getOverview(): array
    {
        $mrr = (float) Subscription::where('status', 'active')->sum('price_amount');

        $activeSubscriptions = Subscription::where('status', 'active')->count();

        $totalRevenue = (float) Invoice::where('status', 'paid')->sum('amount');

        $pendingInvoices = Invoice::where('status', 'pending')->count();

        $paidInvoices = Invoice::where('status', 'paid')->count();

        $avgRevenuePerTenant = $activeSubscriptions > 0
            ? round($mrr / $activeSubscriptions, 2)
            : 0;

        return [
            'mrr' => $mrr,
            'active_subscriptions' => $activeSubscriptions,
            'total_revenue' => $totalRevenue,
            'pending_invoices' => $pendingInvoices,
            'paid_invoices' => $paidInvoices,
            'avg_revenue_per_tenant' => $avgRevenuePerTenant,
        ];
    }

    public function getMonthlyRevenue(int $months = 12): array
    {
        $start = CarbonImmutable::now()->subMonths($months - 1)->startOfMonth();

        $paidInvoices = Invoice::where('status', 'paid')
            ->where('paid_at', '>=', $start)
            ->get(['paid_at', 'amount']);

        $pendingInvoices = Invoice::where('status', 'pending')
            ->where('created_at', '>=', $start)
            ->get(['created_at', 'amount']);

        $paidByMonth = [];
        $pendingByMonth = [];

        foreach ($paidInvoices as $inv) {
            $key = $inv->paid_at->format('Y-m');
            $paidByMonth[$key] = ($paidByMonth[$key] ?? 0) + (float) $inv->amount;
        }

        foreach ($pendingInvoices as $inv) {
            $key = $inv->created_at->format('Y-m');
            $pendingByMonth[$key] = ($pendingByMonth[$key] ?? 0) + (float) $inv->amount;
        }

        $labels = [];
        $paid = [];
        $pending = [];

        for ($i = 0; $i < $months; $i++) {
            $date = $start->addMonthsNoOverflow($i);
            $key = $date->format('Y-m');
            $label = $date->isoFormat('MMM Y');

            $labels[] = $label;
            $paid[] = $paidByMonth[$key] ?? 0;
            $pending[] = $pendingByMonth[$key] ?? 0;
        }

        return [
            'labels' => $labels,
            'paid' => $paid,
            'pending' => $pending,
        ];
    }

    public function getRevenueByPlan(): array
    {
        $plans = Subscription::where('status', 'active')
            ->select('plan_id', DB::raw('COUNT(*) as count'), DB::raw('SUM(price_amount) as revenue'))
            ->groupBy('plan_id')
            ->with('plan:id,name')
            ->get();

        return $plans->map(fn ($sub) => [
            'name' => $sub->plan?->name ?? 'Unknown',
            'count' => $sub->count,
            'revenue' => (float) $sub->revenue,
        ])->toArray();
    }
}
