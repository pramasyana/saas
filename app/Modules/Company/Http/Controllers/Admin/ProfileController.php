<?php

declare(strict_types=1);

namespace App\Modules\Company\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Modules\Company\Http\Requests\UpdateCompanyProfileRequest;
use App\Modules\Company\Services\CompanyService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function __construct(
        private readonly CompanyService $companyService,
    ) {}

    public function edit(string $tenantId): Response
    {
        tenancy()->initialize($tenantId);

        $data = $this->companyService->getProfile($tenantId);

        tenancy()->end();

        return Inertia::render('admin/tenants/company/Profile', array_merge(
            $data,
            ['tenant_id' => $tenantId],
        ));
    }

    public function update(string $tenantId, UpdateCompanyProfileRequest $request): RedirectResponse
    {
        tenancy()->initialize($tenantId);

        $this->companyService->updateProfile($tenantId, $request->validated());

        tenancy()->end();

        return redirect()->back()->with('success', 'Profil perusahaan berhasil diperbarui.');
    }
}
