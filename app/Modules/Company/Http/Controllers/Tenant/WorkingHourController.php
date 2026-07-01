<?php

declare(strict_types=1);

namespace App\Modules\Company\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Modules\Company\Http\Requests\UpdateWorkingHoursRequest;
use App\Modules\Company\Services\CompanyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkingHourController extends Controller
{
    public function __construct(
        private readonly CompanyService $companyService,
    ) {}

    public function edit(Request $request): Response|JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;
        $branchId = $request->query('branch_id');

        $hours = $this->companyService->getWorkingHours($tenantId, $branchId);

        if ($request->wantsJson()) {
            return response()->json(['data' => $hours]);
        }

        return Inertia::render('tenant/company/WorkingHours', [
            'hours' => $hours,
        ]);
    }

    public function update(UpdateWorkingHoursRequest $request): RedirectResponse|JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;

        $this->companyService->updateWorkingHours($tenantId, $request->validated('hours'), $request->input('branch_id'));

        if ($request->wantsJson()) {
            return response()->json(['status' => 'success', 'message' => 'Jam kerja berhasil diperbarui.']);
        }

        return redirect()->back()->with('success', 'Jam kerja berhasil diperbarui.');
    }
}
