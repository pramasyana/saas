<?php

namespace App\Modules\Auth\Actions;

use App\Models\User;
use App\Modules\Auth\Events\TenantRegistered;
use App\Modules\Auth\Http\Requests\RegisterRequest;
use App\Modules\Pricing\Models\Plan;
use App\Modules\Subscription\Services\SubscriptionService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class RegisterTenantAction
{
    public function __construct(
        private readonly SubscriptionService $subscriptionService,
    ) {}

    public function execute(RegisterRequest $request): User
    {
        return DB::transaction(function () use ($request) {
            $plan = Plan::where('id', $request->plan_id)
                ->where('is_active', true)
                ->first();

            if (! $plan) {
                throw new RuntimeException('Paket yang dipilih tidak tersedia.');
            }

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->password,
                'is_admin' => false,
                'is_active' => true,
            ]);

            $this->subscriptionService->subscribe([
                'user_id' => $user->id,
                'plan_id' => $plan->id,
                'billing_interval' => $request->billing_interval,
            ]);

            event(new TenantRegistered($user));

            Log::info('Tenant registered', [
                'user_id' => $user->id,
                'email' => $user->email,
                'plan_id' => $plan->id,
                'plan_slug' => $plan->slug,
            ]);

            return $user;
        });
    }
}
