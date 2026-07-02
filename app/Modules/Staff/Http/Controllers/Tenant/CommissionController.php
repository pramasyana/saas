<?php

declare(strict_types=1);

namespace App\Modules\Staff\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Modules\Staff\Services\StaffService;
use Inertia\Inertia;
use Inertia\Response;

class CommissionController extends Controller
{
    public function __construct(
        private readonly StaffService $staffService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('tenant/staff/commission/index', [
            'title' => 'Komisi',
            'stats' => $this->staffService->getCommissionStats(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('tenant/staff/commission/Create', [
            'title' => 'Tambah Komisi',
        ]);
    }

    public function edit(string $id): Response
    {
        return Inertia::render('tenant/staff/commission/Edit', [
            'title' => 'Edit Komisi',
            'commission' => $this->staffService->getCommissionById($id),
        ]);
    }
}
