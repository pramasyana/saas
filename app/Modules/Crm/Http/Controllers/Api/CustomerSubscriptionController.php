<?php

declare(strict_types=1);

namespace App\Modules\Crm\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Crm\Contracts\CustomerMembershipPlanRepositoryInterface;
use App\Modules\Crm\Contracts\CustomerSubscriptionRepositoryInterface;
use App\Modules\Crm\Http\Requests\StoreCustomerSubscriptionRequest;
use App\Modules\Crm\Http\Resources\CustomerSubscriptionResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CustomerSubscriptionController extends Controller
{
    public function __construct(
        private readonly CustomerSubscriptionRepositoryInterface $subscriptionRepository,
        private readonly CustomerMembershipPlanRepositoryInterface $planRepository,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $subscriptions = $this->subscriptionRepository->paginate(
            auth()->user()->tenant_id,
            $request->only(['search', 'status', 'plan_id']),
            (int) $request->input('per_page', 15),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => CustomerSubscriptionResource::collection($subscriptions),
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
        $subscription = $this->subscriptionRepository->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => new CustomerSubscriptionResource($subscription),
        ]);
    }

    public function store(StoreCustomerSubscriptionRequest $request): JsonResponse
    {
        $data = $request->validated();

        $plan = $this->planRepository->findOrFail($data['plan_id']);

        $subscription = DB::transaction(function () use ($plan, $data) {
            return $this->subscriptionRepository->create([
                'tenant_id' => auth()->user()->tenant_id,
                'customer_id' => $data['customer_id'],
                'plan_id' => $plan->id,
                'plan_name' => $plan->name,
                'price_amount' => $plan->price,
                'billing_interval' => $plan->billing_interval,
                'benefits_snapshot' => $plan->benefits,
                'status' => 'active',
                'start_date' => $data['start_date'] ?? now(),
                'end_date' => $data['end_date'] ?? now()->addMonths($plan->duration_months),
            ]);
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Subscription berhasil ditambahkan.',
            'data' => new CustomerSubscriptionResource($subscription->load(['customer', 'plan'])),
        ], 201);
    }

    public function cancel(string $id): JsonResponse
    {
        $subscription = $this->subscriptionRepository->findOrFail($id);

        if ($subscription->status !== 'active') {
            return response()->json([
                'status' => 'error',
                'message' => 'Subscription tidak dalam status aktif.',
            ], 422);
        }

        $subscription = DB::transaction(function () use ($subscription) {
            return $this->subscriptionRepository->update($subscription, [
                'status' => 'cancelled',
                'cancelled_at' => now(),
            ]);
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Subscription berhasil dibatalkan.',
            'data' => new CustomerSubscriptionResource($subscription->load(['customer', 'plan'])),
        ]);
    }

    public function stats(): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => [
                'total' => $this->subscriptionRepository->countByTenant($tenantId),
                'active' => $this->subscriptionRepository->countActiveByTenant($tenantId),
                'cancelled' => $this->subscriptionRepository->countByStatus($tenantId, 'cancelled'),
                'expired' => $this->subscriptionRepository->countByStatus($tenantId, 'expired'),
            ],
        ]);
    }

    // Customer-specific subscriptions
    public function customerSubscriptions(Request $request, string $customerId): JsonResponse
    {
        $subscriptions = $this->subscriptionRepository->paginate(
            auth()->user()->tenant_id,
            array_merge($request->only(['status']), ['customer_id' => $customerId]),
            (int) $request->input('per_page', 15),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => CustomerSubscriptionResource::collection($subscriptions),
            'meta' => [
                'current_page' => $subscriptions->currentPage(),
                'last_page' => $subscriptions->lastPage(),
                'per_page' => $subscriptions->perPage(),
                'total' => $subscriptions->total(),
            ],
        ]);
    }
}
