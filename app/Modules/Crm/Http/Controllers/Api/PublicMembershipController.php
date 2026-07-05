<?php

declare(strict_types=1);

namespace App\Modules\Crm\Http\Controllers\Api;

use App\Modules\Crm\Models\CustomerMembershipPlan;
use Illuminate\Http\JsonResponse;

class PublicMembershipController
{
    public function plans(): JsonResponse
    {
        $tenantId = tenant()->getTenantKey();

        $plans = CustomerMembershipPlan::where('tenant_id', $tenantId)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($plan) => [
                'id' => $plan->id,
                'name' => $plan->name,
                'description' => $plan->description,
                'price' => (float) $plan->price,
                'billing_interval' => $plan->billing_interval,
                'duration_months' => $plan->duration_months,
                'benefits' => $plan->benefits,
            ]);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => $plans,
        ]);
    }
}
