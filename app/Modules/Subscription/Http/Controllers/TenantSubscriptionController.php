<?php

declare(strict_types=1);

namespace App\Modules\Subscription\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Modules\Pricing\Models\Plan;
use App\Modules\Subscription\Models\Subscription;
use Inertia\Inertia;
use Inertia\Response;

class TenantSubscriptionController extends Controller
{
    public function show(string $tenantId): Response
    {
        $tenant = Tenant::findOrFail($tenantId);

        $subscription = Subscription::with(['user', 'plan', 'invoices'])
            ->where('tenant_id', $tenantId)
            ->where('status', 'active')
            ->first();

        $plans = Plan::with('features.definition')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Plan $plan) => [
                'id' => $plan->id,
                'name' => $plan->name,
                'slug' => $plan->slug,
                'description' => $plan->description,
                'price_monthly' => (float) $plan->price_monthly,
                'price_yearly' => $plan->price_yearly ? (float) $plan->price_yearly : null,
                'is_popular' => $plan->is_popular,
                'features' => $plan->features->map(fn ($f) => [
                    'id' => $f->id,
                    'feature_definition_id' => $f->feature_definition_id,
                    'value' => $f->value,
                    'definition' => [
                        'key' => $f->definition->key,
                        'label' => $f->definition->label,
                        'type' => $f->definition->type,
                        'category' => $f->definition->category,
                    ],
                ]),
            ]);

        return Inertia::render('admin/tenants/company/Subscription', [
            'title' => 'Langganan',
            'tenant_id' => $tenantId,
            'tenant_name' => $tenant->company_name,
            'tenant_email' => $tenant->company_email,
            'subscription' => $subscription ? [
                'id' => $subscription->id,
                'plan_id' => $subscription->plan_id,
                'price_amount' => (float) $subscription->price_amount,
                'billing_interval' => $subscription->billing_interval,
                'status' => $subscription->status,
                'starts_at' => $subscription->starts_at?->toISOString(),
                'ends_at' => $subscription->ends_at?->toISOString(),
                'features_snapshot' => $subscription->features_snapshot,
                'plan' => $subscription->plan ? [
                    'id' => $subscription->plan->id,
                    'name' => $subscription->plan->name,
                    'slug' => $subscription->plan->slug,
                    'price_monthly' => (float) $subscription->plan->price_monthly,
                    'price_yearly' => $subscription->plan->price_yearly ? (float) $subscription->plan->price_yearly : null,
                    'is_popular' => $subscription->plan->is_popular,
                ] : null,
            ] : null,
            'plans' => $plans,
        ]);
    }
}
