<?php

namespace App\Modules\Admin\Services;

use App\Models\Tenant;
use App\Modules\Admin\Contracts\TenantStatsRepositoryInterface;
use App\Modules\Admin\Contracts\UserRepositoryInterface;
use App\Modules\Admin\DTOs\DashboardStatsDTO;
use App\Modules\Subscription\Models\Invoice;
use App\Modules\Subscription\Models\Subscription;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class DashboardService
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
        private readonly TenantStatsRepositoryInterface $tenantStatsRepository,
    ) {}

    public function getStats(): DashboardStatsDTO
    {
        $now = CarbonImmutable::now();
        $totalUsers = $this->userRepository->count();
        $newToday = $this->userRepository->countWhereDate('created_at', '>=', $now->format('Y-m-d'));
        $newThisWeek = $this->userRepository->countWhereBetween('created_at', [$now->startOfWeek(), $now]);
        $newThisMonth = $this->userRepository->countWhereBetween('created_at', [$now->startOfMonth(), $now]);
        $totalAdmins = $this->userRepository->countWhere('is_admin', true);

        $userGrowth = $totalUsers > 0
            ? round(($newThisMonth / $totalUsers) * 100, 1)
            : 0;

        $totalTenants = $this->tenantStatsRepository->count();
        $newTenantsThisMonth = $this->tenantStatsRepository->countWhereBetween('created_at', [$now->startOfMonth(), $now]);

        Log::info('Dashboard stats fetched', [
            'total_users' => $totalUsers,
            'new_today' => $newToday,
            'new_this_week' => $newThisWeek,
            'new_this_month' => $newThisMonth,
            'total_admins' => $totalAdmins,
            'total_tenants' => $totalTenants,
            'new_tenants_this_month' => $newTenantsThisMonth,
        ]);

        return new DashboardStatsDTO(
            total_users: $totalUsers,
            new_today: $newToday,
            new_this_week: $newThisWeek,
            new_this_month: $newThisMonth,
            total_admins: $totalAdmins,
            user_growth: $userGrowth,
            total_tenants: $totalTenants,
            new_tenants_this_month: $newTenantsThisMonth,
        );
    }

    /** @return Collection<int, array{id: int, name: string, email: string, is_admin: bool, created_at: string, joined_at: string}> */
    public function getRecentUsers(int $limit = 5): Collection
    {
        return $this->userRepository->latest($limit)->map(fn ($user) => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'is_admin' => $user->is_admin,
            'created_at' => $user->created_at?->diffForHumans(),
            'joined_at' => $user->created_at?->format('d M Y'),
        ]);
    }

    /** @return Collection<int, array{day: string, count: int}> */
    public function getWeeklySignups(): Collection
    {
        $now = CarbonImmutable::now();
        $days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
        $dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        $result = collect();

        foreach ($dayNames as $i => $day) {
            $result->push([
                'day' => $days[$i],
                'count' => $this->userRepository->countByDayOfWeek('created_at', $now->startOfWeek()->addDays($i)->day),
            ]);
        }

        return $result;
    }

    public function getRevenueOverview(): array
    {
        $mrr = (float) Subscription::where('status', 'active')->sum('price_amount');
        $activeSubs = Subscription::where('status', 'active')->count();
        $totalRevenue = (float) Invoice::where('status', 'paid')->sum('amount');
        $pendingInvoices = Invoice::where('status', 'pending')->count();

        return [
            'mrr' => $mrr,
            'active_subscriptions' => $activeSubs,
            'total_revenue' => $totalRevenue,
            'pending_invoices' => $pendingInvoices,
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

        return compact('labels', 'paid', 'pending');
    }

    /** @return Collection<int, array> */
    public function getRecentSubscriptions(int $limit = 5): Collection
    {
        return Subscription::with(['user', 'plan', 'tenant'])
            ->latest()
            ->limit($limit)
            ->get()
            ->map(fn ($sub) => [
                'id' => $sub->id,
                'tenant_name' => $sub->tenant->getInternal('name') ?? ($sub->user?->name ?? '-'),
                'plan_name' => $sub->plan?->name ?? '-',
                'price_amount' => (float) $sub->price_amount,
                'status' => $sub->status,
                'created_at' => $sub->created_at?->diffForHumans(),
            ]);
    }

    /** @return Collection<int, array> */
    public function getRecentTenants(int $limit = 5): Collection
    {
        return Tenant::with(['user', 'domains'])
            ->latest()
            ->limit($limit)
            ->get()
            ->map(fn ($tenant) => [
                'id' => $tenant->id,
                'name' => $tenant->getInternal('name'),
                'email' => $tenant->getInternal('email'),
                'owner_name' => $tenant->user?->name,
                'domain' => $tenant->domains->first()?->domain,
                'created_at' => $tenant->created_at?->diffForHumans(),
            ]);
    }
}
