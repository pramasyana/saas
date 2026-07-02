<?php

declare(strict_types=1);

namespace App\Modules\Staff\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Modules\Staff\Services\StaffService;
use Inertia\Inertia;
use Inertia\Response;

class StaffController extends Controller
{
    public function __construct(
        private readonly StaffService $staffService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('tenant/staff/Index', [
            'title' => 'Staff',
            'stats' => $this->staffService->getStaffStats(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('tenant/staff/Create', [
            'title' => 'Tambah Staff',
        ]);
    }

    public function edit(string $id): Response
    {
        return Inertia::render('tenant/staff/Edit', [
            'title' => 'Edit Staff',
            'staff' => $this->staffService->findById($id),
        ]);
    }
}
