<?php

declare(strict_types=1);

namespace App\Modules\Company\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Modules\Company\Http\Requests\UpdateWorkingHoursRequest;
use App\Modules\Company\Services\CompanyService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class WorkingHourController extends Controller
{
    public function __construct(
        private readonly CompanyService $companyService,
    ) {}

    public function edit(string $tenantId): Response
    {
        tenancy()->initialize($tenantId);

        $hours = $this->companyService->getWorkingHours($tenantId, null);

        tenancy()->end();

        return Inertia::render('admin/tenants/company/WorkingHours', [
            'tenant_id' => $tenantId,
            'hours' => $hours,
        ]);
    }

    public function update(string $tenantId, UpdateWorkingHoursRequest $request): RedirectResponse
    {
        tenancy()->initialize($tenantId);

        $this->companyService->updateWorkingHours($tenantId, $request->validated('hours'));

        tenancy()->end();

        return redirect()->back()->with('success', 'Jam kerja berhasil diperbarui.');
    }
}
