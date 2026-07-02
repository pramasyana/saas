<?php

declare(strict_types=1);

namespace App\Modules\Company\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Company\Http\Requests\StoreBranchRequest;
use App\Modules\Company\Http\Requests\UpdateBranchRequest;
use App\Modules\Company\Http\Resources\BranchResource;
use App\Modules\Company\Services\CompanyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    public function __construct(
        private readonly CompanyService $companyService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;

        if ($request->boolean('all')) {
            $filters = $request->only(['search', 'is_active', 'sort', 'direction']);
            $filters['per_page'] = 1000;
            $branches = $this->companyService->getBranches($tenantId, $filters);
            return response()->json([
                'status' => 'success',
                'data' => BranchResource::collection($branches->items()),
            ]);
        }

        $filters = $request->only(['search', 'is_active', 'sort', 'direction', 'per_page']);
        $branches = $this->companyService->getBranches($tenantId, $filters);

        return response()->json([
            'status' => 'success',
            'data' => BranchResource::collection($branches->items()),
            'meta' => [
                'current_page' => $branches->currentPage(),
                'last_page' => $branches->lastPage(),
                'per_page' => $branches->perPage(),
                'total' => $branches->total(),
            ],
        ]);
    }

    public function store(StoreBranchRequest $request): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;
        $branch = $this->companyService->createBranch($tenantId, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Cabang berhasil ditambahkan.',
            'data' => new BranchResource($branch),
        ], 201);
    }

    public function update(string $id, UpdateBranchRequest $request): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;
        $branch = $this->companyService->updateBranch($tenantId, $id, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Cabang berhasil diperbarui.',
            'data' => new BranchResource($branch),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;
        $this->companyService->deleteBranch($tenantId, $id);

        return response()->json([
            'status' => 'success',
            'message' => 'Cabang berhasil dihapus.',
        ]);
    }
}
