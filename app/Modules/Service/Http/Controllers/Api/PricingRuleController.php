<?php

declare(strict_types=1);

namespace App\Modules\Service\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Service\Http\Requests\StorePricingRuleRequest;
use App\Modules\Service\Http\Requests\UpdatePricingRuleRequest;
use App\Modules\Service\Http\Resources\PricingRuleResource;
use App\Modules\Service\Services\PricingEngineService;
use App\Modules\Service\Services\PricingRuleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PricingRuleController extends Controller
{
    public function __construct(
        private readonly PricingRuleService $pricingRuleService,
        private readonly PricingEngineService $pricingEngineService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $branchId = $request->input('branch_id');

        $rules = $this->pricingRuleService->paginate(
            $request->only(['search', 'action_type', 'is_active', 'sort', 'direction']),
            $branchId,
            (int) $request->input('per_page', 15),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => PricingRuleResource::collection($rules),
            'meta' => [
                'current_page' => $rules->currentPage(),
                'last_page' => $rules->lastPage(),
                'per_page' => $rules->perPage(),
                'total' => $rules->total(),
            ],
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $rule = $this->pricingRuleService->findById($id);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => new PricingRuleResource($rule),
        ]);
    }

    public function store(StorePricingRuleRequest $request): JsonResponse
    {
        $rule = $this->pricingRuleService->create($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Aturan harga berhasil ditambahkan.',
            'data' => new PricingRuleResource($rule),
        ], 201);
    }

    public function update(UpdatePricingRuleRequest $request, string $id): JsonResponse
    {
        $rule = $this->pricingRuleService->update($id, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Aturan harga berhasil diupdate.',
            'data' => new PricingRuleResource($rule),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $this->pricingRuleService->delete($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Aturan harga berhasil dihapus.',
        ]);
    }

    public function calculate(Request $request): JsonResponse
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.id' => 'nullable|string',
            'items.*.type' => 'nullable|string|in:service,package,addon',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.category_id' => 'nullable|string',
            'branch_id' => 'nullable|string',
            'staff_id' => 'nullable|string',
        ]);

        $result = $this->pricingEngineService->calculate(auth()->user()->tenant_id, $request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => $result,
        ]);
    }
}
