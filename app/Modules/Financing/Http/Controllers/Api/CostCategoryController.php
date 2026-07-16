<?php

declare(strict_types=1);

namespace App\Modules\Financing\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Financing\Contracts\CostCategoryRepositoryInterface;
use App\Modules\Financing\Http\Requests\StoreCostCategoryRequest;
use App\Modules\Financing\Http\Resources\CostCategoryResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CostCategoryController extends Controller
{
    public function __construct(
        private readonly CostCategoryRepositoryInterface $categoryRepository,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $tenantId = $request->user()->tenant_id;
        $categories = $this->categoryRepository->findAllByTenant($tenantId);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => CostCategoryResource::collection($categories),
        ]);
    }

    public function store(StoreCostCategoryRequest $request): JsonResponse
    {
        $tenantId = $request->user()->tenant_id;
        $category = $this->categoryRepository->create([
            ...$request->validated(),
            'tenant_id' => $tenantId,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Kategori biaya berhasil ditambahkan.',
            'data' => new CostCategoryResource($category),
        ], 201);
    }

    public function update(StoreCostCategoryRequest $request, string $id): JsonResponse
    {
        $category = $this->categoryRepository->findOrFail($id);
        $updated = $this->categoryRepository->update($category, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Kategori biaya berhasil diupdate.',
            'data' => new CostCategoryResource($updated),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $category = $this->categoryRepository->findOrFail($id);
        $this->categoryRepository->delete($category);

        return response()->json([
            'status' => 'success',
            'message' => 'Kategori biaya berhasil dihapus.',
        ]);
    }
}
