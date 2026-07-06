<?php

namespace App\Modules\Subscription\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Subscription\Http\Requests\CancelSubscriptionRequest;
use App\Modules\Subscription\Http\Requests\ChangePlanRequest;
use App\Modules\Subscription\Http\Requests\StoreSubscriptionRequest;
use App\Modules\Subscription\Http\Resources\SubscriptionResource;
use App\Modules\Subscription\Services\SubscriptionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function __construct(
        private readonly SubscriptionService $subscriptionService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $subscriptions = $this->subscriptionService->paginate(
            $request->only(['search', 'status', 'sort', 'direction']),
            (int) $request->input('per_page', 15),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => SubscriptionResource::collection($subscriptions),
            'meta' => [
                'current_page' => $subscriptions->currentPage(),
                'last_page' => $subscriptions->lastPage(),
                'per_page' => $subscriptions->perPage(),
                'total' => $subscriptions->total(),
            ],
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $subscription = $this->subscriptionService->findById($id);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => new SubscriptionResource($subscription),
        ]);
    }

    public function store(StoreSubscriptionRequest $request): JsonResponse
    {
        $subscription = $this->subscriptionService->subscribe($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Subscription berhasil dibuat.',
            'data' => new SubscriptionResource($subscription),
        ], 201);
    }

    public function cancel(string $id, CancelSubscriptionRequest $request): JsonResponse
    {
        try {
            $subscription = $this->subscriptionService->cancel($id, $request->input('reason'));

            return response()->json([
                'status' => 'success',
                'message' => 'Subscription berhasil dibatalkan.',
                'data' => new SubscriptionResource($subscription),
            ]);
        } catch (\RuntimeException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function changePlan(string $id, ChangePlanRequest $request): JsonResponse
    {
        try {
            $subscription = $this->subscriptionService->changePlan(
                $id,
                $request->input('plan_id'),
                $request->input('billing_interval'),
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Subscription berhasil diubah.',
                'data' => new SubscriptionResource($subscription),
            ]);
        } catch (\RuntimeException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
