<?php

namespace App\Modules\Admin\Services;

use App\Modules\Admin\Contracts\TenantStatsRepositoryInterface;
use App\Modules\Admin\Contracts\UserRepositoryInterface;
use App\Modules\Admin\DTOs\DashboardStatsDTO;
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
}
