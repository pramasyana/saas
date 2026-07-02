<?php

declare(strict_types=1);

namespace App\Modules\Company\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Company\Http\Requests\UpdateCompanyProfileRequest;
use App\Modules\Company\Http\Resources\CompanyProfileResource;
use App\Modules\Company\Services\CompanyService;
use Illuminate\Http\JsonResponse;

class ProfileController extends Controller
{
    public function __construct(
        private readonly CompanyService $companyService,
    ) {}

    public function show(): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;
        $data = $this->companyService->getProfile($tenantId);

        return response()->json([
            'data' => $data['profile'] ? new CompanyProfileResource($data['profile']) : null,
        ]);
    }

    public function update(UpdateCompanyProfileRequest $request): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;
        $this->companyService->updateProfile($tenantId, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Profil perusahaan berhasil diperbarui.',
        ]);
    }
}
