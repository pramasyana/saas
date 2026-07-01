<?php

namespace App\Modules\Pricing\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Pricing\Http\Resources\PlanResource;
use App\Modules\Pricing\Services\PlanService;
use Illuminate\Http\JsonResponse;

class PublicPlanController extends Controller
{
    public function __construct(
        private readonly PlanService $planService,
    ) {}

    public function index(): JsonResponse
    {
        $plans = $this->planService->paginate(['is_active' => '1'], 50);

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
}
