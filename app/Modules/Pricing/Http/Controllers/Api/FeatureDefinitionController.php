<?php

namespace App\Modules\Pricing\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Pricing\Http\Requests\StoreFeatureDefinitionRequest;
use App\Modules\Pricing\Http\Requests\UpdateFeatureDefinitionRequest;
use App\Modules\Pricing\Http\Resources\FeatureDefinitionResource;
use App\Modules\Pricing\Services\FeatureDefinitionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeatureDefinitionController extends Controller
{
    public function __construct(
        private readonly FeatureDefinitionService $featureDefinitionService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $definitions = $this->featureDefinitionService->getAll();

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => FeatureDefinitionResource::collection($definitions),
        ]);
    }

    public function store(StoreFeatureDefinitionRequest $request): JsonResponse
    {
        $definition = $this->featureDefinitionService->create($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Feature definition berhasil dibuat.',
            'data' => new FeatureDefinitionResource($definition),
        ], 201);
    }

    public function update(string $id, UpdateFeatureDefinitionRequest $request): JsonResponse
    {
        $definition = $this->featureDefinitionService->update($id, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Feature definition berhasil diupdate.',
            'data' => new FeatureDefinitionResource($definition),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $this->featureDefinitionService->delete($id);
            return response()->json([
                'status' => 'success',
                'message' => 'Feature definition berhasil dihapus.',
            ]);
        } catch (\RuntimeException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
