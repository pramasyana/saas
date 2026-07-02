<?php

declare(strict_types=1);

namespace App\Modules\Service\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Service\Http\Requests\StoreCategoryRequest;
use App\Modules\Service\Http\Requests\UpdateCategoryRequest;
use App\Modules\Service\Http\Resources\CategoryResource;
use App\Modules\Service\Services\CategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(
        private readonly CategoryService $categoryService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $categories = $this->categoryService->paginate(
            $request->only(['search', 'is_active', 'sort', 'direction']),
            (int) $request->input('per_page', 15),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => CategoryResource::collection($categories),
            'meta' => [
                'current_page' => $categories->currentPage(),
                'last_page' => $categories->lastPage(),
                'per_page' => $categories->perPage(),
                'total' => $categories->total(),
            ],
        ]);
    }

    public function all(): JsonResponse
    {
        $categories = $this->categoryService->findAll();

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => CategoryResource::collection($categories),
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $category = $this->categoryService->findById($id);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => new CategoryResource($category),
        ]);
    }

    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = $this->categoryService->create($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Kategori berhasil ditambahkan.',
            'data' => new CategoryResource($category),
        ], 201);
    }

    public function update(UpdateCategoryRequest $request, string $id): JsonResponse
    {
        $category = $this->categoryService->update($id, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Kategori berhasil diupdate.',
            'data' => new CategoryResource($category),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $this->categoryService->delete($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Kategori berhasil dihapus.',
        ]);
    }
}
