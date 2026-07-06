<?php

declare(strict_types=1);

namespace App\Modules\Company\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Modules\Company\Http\Requests\StoreHolidayRequest;
use App\Modules\Company\Http\Requests\UpdateHolidayRequest;
use App\Modules\Company\Services\CompanyService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HolidayController extends Controller
{
    public function __construct(
        private readonly CompanyService $companyService,
    ) {}

    public function index(string $tenantId, Request $request): Response
    {
        $tenant = Tenant::find($tenantId);

        tenancy()->initialize($tenantId);

        $holidays = $this->companyService->getHolidays($tenantId, $request->only(['search', 'branch_id', 'year', 'upcoming', 'sort', 'direction', 'per_page']));

        tenancy()->end();

        return Inertia::render('admin/tenants/company/Holidays', [
            'tenant_id' => $tenantId,
            'tenant_name' => $tenant?->getCompanyNameAttribute(),
            'tenant_email' => $tenant?->getCompanyEmailAttribute(),
            'holidays' => $holidays,
        ]);
    }

    public function store(string $tenantId, StoreHolidayRequest $request): RedirectResponse
    {
        tenancy()->initialize($tenantId);

        $this->companyService->createHoliday($tenantId, $request->validated());

        tenancy()->end();

        return redirect()->back()->with('success', 'Hari libur berhasil ditambahkan.');
    }

    public function update(string $tenantId, string $id, UpdateHolidayRequest $request): RedirectResponse
    {
        tenancy()->initialize($tenantId);

        $this->companyService->updateHoliday($tenantId, $id, $request->validated());

        tenancy()->end();

        return redirect()->back()->with('success', 'Hari libur berhasil diperbarui.');
    }

    public function destroy(string $tenantId, string $id): RedirectResponse
    {
        tenancy()->initialize($tenantId);

        $this->companyService->deleteHoliday($tenantId, $id);

        tenancy()->end();

        return redirect()->back()->with('success', 'Hari libur berhasil dihapus.');
    }
}
