<?php

declare(strict_types=1);

namespace App\Modules\Staff\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Modules\Staff\Services\StaffService;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function __construct(
        private readonly StaffService $staffService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('tenant/staff/attendance/index', [
            'title' => 'Absensi',
            'stats' => $this->staffService->getAttendanceStats(now()->format('Y-m-d')),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('tenant/staff/attendance/Create', [
            'title' => 'Tambah Absensi',
        ]);
    }

    public function edit(string $id): Response
    {
        return Inertia::render('tenant/staff/attendance/Edit', [
            'title' => 'Edit Absensi',
            'attendance' => $this->staffService->getAttendanceById($id),
        ]);
    }
}
