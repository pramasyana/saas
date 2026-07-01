<?php

declare(strict_types=1);

namespace App\Modules\Tenant\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Tenant\Http\Requests\StoreTenantRequest;
use App\Modules\Tenant\Http\Requests\UpdateTenantRequest;
use App\Modules\Tenant\Http\Resources\TenantResource;
use App\Modules\Tenant\Services\TenantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TenantController extends Controller
{
    public function __construct(
        private readonly TenantService $tenantService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $tenants = $this->tenantService->paginate(
            $request->only(['search', 'sort', 'direction']),
            (int) $request->input('per_page', 15),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => TenantResource::collection($tenants),
            'meta' => [
                'current_page' => $tenants->currentPage(),
                'last_page' => $tenants->lastPage(),
                'per_page' => $tenants->perPage(),
                'total' => $tenants->total(),
            ],
        ]);
    }

    public function store(StoreTenantRequest $request): JsonResponse
    {
        $tenant = $this->tenantService->create($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Tenant berhasil dibuat.',
            'data' => new TenantResource($tenant),
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $tenant = $this->tenantService->findById($id);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => new TenantResource($tenant),
        ]);
    }

    public function update(UpdateTenantRequest $request, string $id): JsonResponse
    {
        $tenant = $this->tenantService->update($id, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Tenant berhasil diupdate.',
            'data' => new TenantResource($tenant),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $this->tenantService->delete($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Tenant berhasil dihapus.',
            ]);
        } catch (\RuntimeException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
