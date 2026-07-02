<?php

declare(strict_types=1);

namespace App\Modules\Service\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Modules\Service\Services\ServiceService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function __construct(
        private readonly ServiceService $serviceService,
    ) {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'category_id', 'is_active']);
        $perPage = (int) ($request->input('per_page', 15));
        $branchId = $request->input('branch_id');

        return Inertia::render('tenant/service/services/Index', [
            'title' => 'Layanan',
            'stats' => $this->serviceService->getStats(),
            'data' => $this->serviceService->paginate($filters, $branchId, $perPage),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('tenant/service/services/Create', [
            'title' => 'Tambah Layanan',
        ]);
    }

    public function edit(string $id): Response
    {
        return Inertia::render('tenant/service/services/Edit', [
            'title' => 'Edit Layanan',
            'service' => $this->serviceService->findById($id),
        ]);
    }
}
