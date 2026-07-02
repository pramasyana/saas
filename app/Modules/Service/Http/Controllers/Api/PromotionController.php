<?php

declare(strict_types=1);

namespace App\Modules\Service\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Service\Http\Requests\StorePromotionRequest;
use App\Modules\Service\Http\Requests\UpdatePromotionRequest;
use App\Modules\Service\Http\Resources\PromotionResource;
use App\Modules\Service\Services\PromotionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
    public function __construct(
        private readonly PromotionService $promotionService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $promotions = $this->promotionService->paginate(
            $request->only(['search', 'promotion_type', 'is_active', 'sort', 'direction']),
            (int) $request->input('per_page', 15),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => PromotionResource::collection($promotions),
            'meta' => [
                'current_page' => $promotions->currentPage(),
                'last_page' => $promotions->lastPage(),
                'per_page' => $promotions->perPage(),
                'total' => $promotions->total(),
            ],
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $promotion = $this->promotionService->findById($id);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => new PromotionResource($promotion),
        ]);
    }

    public function store(StorePromotionRequest $request): JsonResponse
    {
        $promotion = $this->promotionService->create($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Promosi berhasil ditambahkan.',
            'data' => new PromotionResource($promotion),
        ], 201);
    }

    public function update(UpdatePromotionRequest $request, string $id): JsonResponse
    {
        $promotion = $this->promotionService->update($id, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Promosi berhasil diupdate.',
            'data' => new PromotionResource($promotion),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $this->promotionService->delete($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Promosi berhasil dihapus.',
        ]);
    }
}
