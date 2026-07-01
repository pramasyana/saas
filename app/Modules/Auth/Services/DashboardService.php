<?php

namespace App\Modules\Auth\Services;

use App\Models\User;
use App\Modules\Subscription\Models\Subscription;

class DashboardService
{
    public function getStats(User $user): array
    {
        $subscription = Subscription::with('plan')
            ->where('user_id', $user->id)
            ->latest()
            ->first();

        return [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'joined_at' => $user->created_at,
            ],
            'subscription' => $subscription ? [
                'plan_name' => $subscription->plan?->name,
                'plan_slug' => $subscription->plan?->slug,
                'status' => $subscription->status,
                'price_amount' => (float) $subscription->price_amount,
                'billing_interval' => $subscription->billing_interval,
                'starts_at' => $subscription->starts_at,
                'ends_at' => $subscription->ends_at,
                'features' => $subscription->features_snapshot,
            ] : null,
        ];
    }
}
