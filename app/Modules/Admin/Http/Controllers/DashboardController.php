<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Admin\Services\DashboardService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private readonly DashboardService $dashboardService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => $this->dashboardService->getStats()->toArray(),
            'recent_users' => $this->dashboardService->getRecentUsers(),
            'weekly_signups' => $this->dashboardService->getWeeklySignups(),
            'revenue_overview' => $this->dashboardService->getRevenueOverview(),
            'monthly_revenue' => $this->dashboardService->getMonthlyRevenue(),
            'recent_subscriptions' => $this->dashboardService->getRecentSubscriptions(),
            'recent_tenants' => $this->dashboardService->getRecentTenants(),
        ]);
    }
}
