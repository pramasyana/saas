<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Admin\Services\RevenueService;
use Inertia\Inertia;
use Inertia\Response;

class RevenueController extends Controller
{
    public function __construct(
        private readonly RevenueService $revenueService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/revenue/index', [
            'title' => 'Revenue',
            'overview' => $this->revenueService->getOverview(),
            'monthly' => $this->revenueService->getMonthlyRevenue(),
            'by_plan' => $this->revenueService->getRevenueByPlan(),
        ]);
    }
}
