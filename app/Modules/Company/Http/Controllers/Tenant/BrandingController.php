<?php

declare(strict_types=1);

namespace App\Modules\Company\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Modules\Company\Http\Requests\UpdateCompanyBrandingRequest;
use App\Modules\Company\Services\CompanyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BrandingController extends Controller
{
    public function __construct(
        private readonly CompanyService $companyService,
    ) {}

    public function edit(Request $request): Response|JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;

        $data = $this->companyService->getBranding($tenantId);

        if ($request->wantsJson()) {
            return response()->json(['data' => $data['branding']]);
        }

        return Inertia::render('tenant/company/Branding', $data);
    }

    public function update(UpdateCompanyBrandingRequest $request): RedirectResponse|JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;

        $this->companyService->updateBranding($tenantId, $request->validated());

        if ($request->wantsJson()) {
            return response()->json(['status' => 'success', 'message' => 'Branding berhasil diperbarui.']);
        }

        return redirect()->back()->with('success', 'Branding berhasil diperbarui.');
    }
}
