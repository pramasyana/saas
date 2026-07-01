<?php

declare(strict_types=1);

namespace App\Modules\Company\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Modules\Company\Http\Requests\StoreBranchRequest;
use App\Modules\Company\Http\Requests\UpdateBranchRequest;
use App\Modules\Company\Services\CompanyService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BranchController extends Controller
{
    public function __construct(
        private readonly CompanyService $companyService,
    ) {}

    public function index(string $tenantId, Request $request): Response
    {
        tenancy()->initialize($tenantId);

        $branches = $this->companyService->getBranches($tenantId, $request->only(['search', 'is_active', 'sort', 'direction', 'per_page']));

        tenancy()->end();

        return Inertia::render('admin/tenants/company/Branches', [
            'tenant_id' => $tenantId,
            'branches' => $branches,
        ]);
    }

    public function store(string $tenantId, StoreBranchRequest $request): RedirectResponse
    {
        tenancy()->initialize($tenantId);

        $this->companyService->createBranch($tenantId, $request->validated());

        tenancy()->end();

        return redirect()->back()->with('success', 'Cabang berhasil ditambahkan.');
    }

    public function update(string $tenantId, string $id, UpdateBranchRequest $request): RedirectResponse
    {
        tenancy()->initialize($tenantId);

        $this->companyService->updateBranch($tenantId, $id, $request->validated());

        tenancy()->end();

        return redirect()->back()->with('success', 'Cabang berhasil diperbarui.');
    }

    public function destroy(string $tenantId, string $id): RedirectResponse
    {
        tenancy()->initialize($tenantId);

        $this->companyService->deleteBranch($tenantId, $id);

        tenancy()->end();

        return redirect()->back()->with('success', 'Cabang berhasil dihapus.');
    }
}
