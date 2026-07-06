<?php

namespace App\Modules\Pricing\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Admin\Services\ActivityLogService;
use App\Modules\Pricing\Http\Requests\StorePlanRequest;
use App\Modules\Pricing\Http\Requests\UpdatePlanRequest;
use App\Modules\Pricing\Http\Resources\PlanResource;
use App\Modules\Pricing\Services\PlanService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    public function __construct(
        private readonly PlanService $planService,
        private readonly ActivityLogService $logService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $plans = $this->planService->paginate(
            $request->only(['search', 'is_active', 'sort', 'direction']),
            (int) $request->input('per_page', 15),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => PlanResource::collection($plans),
            'meta' => [
                'current_page' => $plans->currentPage(),
                'last_page' => $plans->lastPage(),
                'per_page' => $plans->perPage(),
                'total' => $plans->total(),
            ],
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $plan = $this->planService->findById($id);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => new PlanResource($plan),
        ]);
    }

    public function store(StorePlanRequest $request): JsonResponse
    {
        $plan = $this->planService->create($request->validated());

        $this->logService->logFromRequest($request, 'created', 'Membuat plan: '.$plan->name, 'plan', $plan->id);

        return response()->json([
            'status' => 'success',
            'message' => 'Plan berhasil dibuat.',
            'data' => new PlanResource($plan),
        ], 201);
    }

    public function update(string $id, UpdatePlanRequest $request): JsonResponse
    {
        $plan = $this->planService->update($id, $request->validated());

        $this->logService->logFromRequest($request, 'updated', 'Mengupdate plan: '.$plan->name, 'plan', $plan->id);

        return response()->json([
            'status' => 'success',
            'message' => 'Plan berhasil diupdate.',
            'data' => new PlanResource($plan),
        ]);
    }

    public function togglePopular(Request $request, string $id): JsonResponse
    {
        $plan = $this->planService->togglePopular($id);

        $this->logService->logFromRequest($request, 'updated', ($plan->is_popular ? 'Menandai' : 'Menghapus tanda').' plan populer: '.$plan->name, 'plan', $plan->id);

        return response()->json([
            'status' => 'success',
            'message' => 'Plan populer berhasil diperbarui.',
            'data' => new PlanResource($plan),
        ]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        try {
            $plan = $this->planService->findById($id);
            $planName = $plan->name;

            $this->planService->delete($id);

            $this->logService->logFromRequest($request, 'deleted', 'Menghapus plan: '.$planName, 'plan', $id);

            return response()->json([
                'status' => 'success',
                'message' => 'Plan berhasil dihapus.',
            ]);
        } catch (\RuntimeException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
