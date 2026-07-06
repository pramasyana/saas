<?php

namespace App\Modules\Admin\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Modules\Admin\Services\TenantActivityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function __construct(
        private readonly TenantActivityService $activityService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $tenants = $this->activityService->paginate(
            $request->only(['search', 'status']),
            (int) $request->input('per_page', 15),
        );

        $data = $tenants->map(function (Tenant $tenant) {
            $subscription = $tenant->subscriptions->first();
            $domain = $tenant->domains->first();

            return [
                'id' => $tenant->id,
                'name' => $tenant->getInternal('name'),
                'email' => $tenant->getInternal('email'),
                'phone' => $tenant->getInternal('phone'),
                'domain' => $domain ? $domain->domain : null,
                'owner' => $tenant->user ? [
                    'id' => $tenant->user->id,
                    'name' => $tenant->user->name,
                    'email' => $tenant->user->email,
                ] : null,
                'subscription' => $subscription ? [
                    'id' => $subscription->id,
                    'status' => $subscription->status,
                    'plan_name' => $subscription->plan?->name,
                    'price_amount' => (float) $subscription->price_amount,
                ] : null,
                'users_count' => (int) $tenant->users_count,
                'branches_count' => (int) $tenant->branches_count,
                'has_profile' => $tenant->companyProfile !== null,
                'created_at' => $tenant->created_at?->toISOString(),
            ];
        });

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => $data,
            'meta' => [
                'current_page' => $tenants->currentPage(),
                'last_page' => $tenants->lastPage(),
                'per_page' => $tenants->perPage(),
                'total' => $tenants->total(),
            ],
        ]);
    }
}
