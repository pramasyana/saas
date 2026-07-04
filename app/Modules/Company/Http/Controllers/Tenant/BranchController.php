<?php

declare(strict_types=1);

namespace App\Modules\Company\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Modules\Company\Services\CompanyService;
use Inertia\Inertia;
use Inertia\Response;

class BranchController extends Controller
{
    public function __construct(
        private readonly CompanyService $companyService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('tenant/company/Branches', [
            'title' => 'Cabang',
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('tenant/company/BranchCreate', [
            'title' => 'Tambah Cabang',
        ]);
    }

    public function edit(string $id): Response
    {
        $tenantId = auth()->user()->tenant_id;
        $branch = $this->companyService->findBranch($tenantId, $id);

        return Inertia::render('tenant/company/BranchEdit', [
            'title' => 'Edit Cabang',
            'branch' => $branch,
        ]);
    }
}
