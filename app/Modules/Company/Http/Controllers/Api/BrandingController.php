<?php

declare(strict_types=1);

namespace App\Modules\Company\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Company\Http\Requests\UpdateCompanyBrandingRequest;
use App\Modules\Company\Http\Resources\CompanyBrandingResource;
use App\Modules\Company\Services\CompanyService;
use Illuminate\Http\JsonResponse;

class BrandingController extends Controller
{
    public function __construct(
        private readonly CompanyService $companyService,
    ) {}

    public function show(): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;
        $data = $this->companyService->getBranding($tenantId);

        return response()->json([
            'data' => $data['branding'] ? new CompanyBrandingResource($data['branding']) : null,
        ]);
    }

    public function update(UpdateCompanyBrandingRequest $request): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;
        $this->companyService->updateBranding($tenantId, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Branding berhasil diperbarui.',
        ]);
    }
}
