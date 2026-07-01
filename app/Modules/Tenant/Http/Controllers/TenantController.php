<?php

declare(strict_types=1);

namespace App\Modules\Tenant\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Tenant\Contracts\TenantRepositoryInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TenantController extends Controller
{
    public function __construct(
        private readonly TenantRepositoryInterface $tenantRepository,
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/tenants/index', [
            'title' => 'Tenants',
            'stats' => $this->tenantRepository->getStats(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/tenants/Create', [
            'title' => 'Tambah Tenant',
        ]);
    }

    public function edit(string $id): Response
    {
        $tenant = $this->tenantRepository->findByIdWithRelations($id);

        abort_unless((bool) $tenant, 404);

        return Inertia::render('admin/tenants/Edit', [
            'title' => 'Edit Tenant',
            'tenant' => [
                'id' => $tenant->id,
                'name' => $tenant->company_name,
                'email' => $tenant->company_email,
                'phone' => $tenant->company_phone,
                'domains' => $tenant->domains->pluck('domain'),
                'user' => $tenant->user ? [
                    'id' => $tenant->user->id,
                    'name' => $tenant->user->name,
                    'email' => $tenant->user->email,
                ] : null,
            ],
        ]);
    }
}
