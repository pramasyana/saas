<?php

declare(strict_types=1);

namespace App\Modules\Crm\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Crm\Contracts\CustomerMembershipPlanRepositoryInterface;
use App\Modules\Crm\Http\Requests\StoreCustomerMembershipPlanRequest;
use App\Modules\Crm\Http\Requests\UpdateCustomerMembershipPlanRequest;
use App\Modules\Crm\Http\Resources\CustomerMembershipPlanResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerMembershipPlanController extends Controller
{
    public function __construct(
        private readonly CustomerMembershipPlanRepositoryInterface $planRepository,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $plans = $this->planRepository->paginate(
            auth()->user()->tenant_id,
            $request->only(['search', 'is_active', 'billing_interval']),
            (int) $request->input('per_page', 15),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => CustomerMembershipPlanResource::collection($plans),
            'meta' => [
                'current_page' => $plans->currentPage(),
                'last_page' => $plans->lastPage(),
                'per_page' => $plans->perPage(),
                'total' => $plans->total(),
            ],
        ]);
    }

    public function all(Request $request): JsonResponse
    {
        $plans = $this->planRepository->findAllByTenant(auth()->user()->tenant_id);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => CustomerMembershipPlanResource::collection($plans),
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $plan = $this->planRepository->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => new CustomerMembershipPlanResource($plan),
        ]);
    }

    public function store(StoreCustomerMembershipPlanRequest $request): JsonResponse
    {
        $data = $request->validated();

        if (! isset($data['duration_months'])) {
            $data['duration_months'] = $data['billing_interval'] === 'yearly' ? 12 : 1;
        }

        $plan = $this->planRepository->create(array_merge($data, [
            'tenant_id' => auth()->user()->tenant_id,
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Plan membership berhasil ditambahkan.',
            'data' => new CustomerMembershipPlanResource($plan),
        ], 201);
    }

    public function update(UpdateCustomerMembershipPlanRequest $request, string $id): JsonResponse
    {
        $plan = $this->planRepository->findOrFail($id);
        $plan = $this->planRepository->update($plan, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Plan membership berhasil diupdate.',
            'data' => new CustomerMembershipPlanResource($plan),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $plan = $this->planRepository->findOrFail($id);
        $this->planRepository->delete($plan);

        return response()->json([
            'status' => 'success',
            'message' => 'Plan membership berhasil dihapus.',
        ]);
    }

    public function stats(): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => [
                'total_plans' => $this->planRepository->countByTenant($tenantId),
                'active_plans' => $this->planRepository->countActiveByTenant($tenantId),
            ],
        ]);
    }
}
