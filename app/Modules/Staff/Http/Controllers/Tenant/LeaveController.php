<?php

declare(strict_types=1);

namespace App\Modules\Staff\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Modules\Staff\Services\StaffService;
use Inertia\Inertia;
use Inertia\Response;

class LeaveController extends Controller
{
    public function __construct(
        private readonly StaffService $staffService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('tenant/staff/leave/index', [
            'title' => 'Cuti',
            'stats' => $this->staffService->getLeaveStats(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('tenant/staff/leave/Create', [
            'title' => 'Ajukan Cuti',
        ]);
    }
}
