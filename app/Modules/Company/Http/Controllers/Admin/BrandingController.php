<?php

declare(strict_types=1);

namespace App\Modules\Company\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Modules\Company\Http\Requests\UpdateCompanyBrandingRequest;
use App\Modules\Company\Services\CompanyService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BrandingController extends Controller
{
    public function __construct(
        private readonly CompanyService $companyService,
    ) {}

    public function edit(string $tenantId): Response
    {
        tenancy()->initialize($tenantId);

        $data = $this->companyService->getBranding($tenantId);

        tenancy()->end();

        return Inertia::render('admin/tenants/company/Branding', array_merge(
            $data,
            ['tenant_id' => $tenantId],
        ));
    }

    public function update(string $tenantId, UpdateCompanyBrandingRequest $request): RedirectResponse
    {
        tenancy()->initialize($tenantId);

        $this->companyService->updateBranding($tenantId, $request->validated());

        tenancy()->end();

        return redirect()->back()->with('success', 'Branding berhasil diperbarui.');
    }
}
