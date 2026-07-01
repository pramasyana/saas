<?php

declare(strict_types=1);

namespace App\Modules\Company\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Modules\Company\Http\Requests\StoreBranchRequest;
use App\Modules\Company\Http\Requests\UpdateBranchRequest;
use App\Modules\Company\Services\CompanyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BranchController extends Controller
{
    public function __construct(
        private readonly CompanyService $companyService,
    ) {}

    public function index(Request $request): Response|JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;

        $filters = $request->only(['search', 'is_active', 'sort', 'direction', 'per_page']);
        $branches = $this->companyService->getBranches($tenantId, $filters);

        if ($request->wantsJson()) {
            return response()->json([
                'data' => $branches->items(),
                'meta' => [
                    'current_page' => $branches->currentPage(),
                    'last_page' => $branches->lastPage(),
                    'per_page' => $branches->perPage(),
                    'total' => $branches->total(),
                ],
            ]);
        }

        return Inertia::render('tenant/company/Branches', [
            'branches' => $branches,
        ]);
    }

    public function store(StoreBranchRequest $request): RedirectResponse|JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;

        $branch = $this->companyService->createBranch($tenantId, $request->validated());

        if ($request->wantsJson()) {
            return response()->json(['status' => 'success', 'message' => 'Cabang berhasil ditambahkan.', 'data' => $branch], 201);
        }

        return redirect()->back()->with('success', 'Cabang berhasil ditambahkan.');
    }

    public function update(string $id, UpdateBranchRequest $request): RedirectResponse|JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;

        $branch = $this->companyService->updateBranch($tenantId, $id, $request->validated());

        if ($request->wantsJson()) {
            return response()->json(['status' => 'success', 'message' => 'Cabang berhasil diperbarui.', 'data' => $branch]);
        }

        return redirect()->back()->with('success', 'Cabang berhasil diperbarui.');
    }

    public function destroy(string $id, Request $request): RedirectResponse|JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;

        $this->companyService->deleteBranch($tenantId, $id);

        if ($request->wantsJson()) {
            return response()->json(['status' => 'success', 'message' => 'Cabang berhasil dihapus.']);
        }

        return redirect()->back()->with('success', 'Cabang berhasil dihapus.');
    }
}
