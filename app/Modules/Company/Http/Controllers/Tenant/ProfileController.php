<?php

declare(strict_types=1);

namespace App\Modules\Company\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Modules\Company\Http\Requests\UpdateCompanyProfileRequest;
use App\Modules\Company\Services\CompanyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function __construct(
        private readonly CompanyService $companyService,
    ) {}

    public function edit(Request $request): Response|JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;

        $data = $this->companyService->getProfile($tenantId);

        if ($request->wantsJson()) {
            return response()->json(['data' => $data['profile']]);
        }

        return Inertia::render('tenant/company/Profile', $data);
    }

    public function update(UpdateCompanyProfileRequest $request): RedirectResponse|JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;

        $this->companyService->updateProfile($tenantId, $request->validated());

        if ($request->wantsJson()) {
            return response()->json(['status' => 'success', 'message' => 'Profil perusahaan berhasil diperbarui.']);
        }

        return redirect()->back()->with('success', 'Profil perusahaan berhasil diperbarui.');
    }
}
