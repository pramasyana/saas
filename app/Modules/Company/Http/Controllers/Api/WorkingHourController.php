<?php

declare(strict_types=1);

namespace App\Modules\Company\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Company\Http\Requests\UpdateWorkingHoursRequest;
use App\Modules\Company\Http\Resources\WorkingHourResource;
use App\Modules\Company\Services\CompanyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkingHourController extends Controller
{
    public function __construct(
        private readonly CompanyService $companyService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;
        $branchId = $request->query('branch_id');
        $hours = $this->companyService->getWorkingHours($tenantId, $branchId);

        return response()->json([
            'data' => WorkingHourResource::collection($hours),
        ]);
    }

    public function update(UpdateWorkingHoursRequest $request): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;
        $this->companyService->updateWorkingHours(
            $tenantId,
            $request->validated('hours'),
            $request->input('branch_id'),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Jam kerja berhasil diperbarui.',
        ]);
    }
}
