<?php

declare(strict_types=1);

namespace App\Modules\Auth\Actions;

use App\Models\Tenant;
use App\Models\User;
use App\Modules\Auth\Contracts\AuthUserRepositoryInterface;
use App\Modules\Auth\Events\TenantRegistered;
use App\Modules\Auth\Http\Requests\RegisterRequest;
use App\Modules\Pricing\Models\Plan;
use App\Modules\Subscription\Services\SubscriptionService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RuntimeException;

class RegisterTenantAction
{
    public function __construct(
        private readonly SubscriptionService $subscriptionService,
        private readonly AuthUserRepositoryInterface $userRepository,
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

            $user = $this->userRepository->create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->password,
                'is_admin' => false,
                'is_active' => true,
            ]);

            $slug = Str::slug($request->company);

            $tenant = Tenant::create([
                'user_id' => $user->id,
            ]);

            $tenant->setInternal('name', $request->company);
            $tenant->setInternal('email', $request->email);
            $tenant->setInternal('phone', $request->phone);
            $tenant->save();

            $tenant->domains()->create([
                'domain' => $slug.'.localhost',
            ]);

            $user->update(['tenant_id' => $tenant->id]);

            $this->subscriptionService->subscribe([
                'user_id' => $user->id,
                'tenant_id' => $tenant->id,
                'plan_id' => $plan->id,
                'billing_interval' => $request->billing_interval,
            ]);

            event(new TenantRegistered($user, $tenant));

            Log::info('Tenant registered', [
                'tenant_id' => $tenant->id,
                'user_id' => $user->id,
                'email' => $user->email,
                'company' => $request->company,
                'plan_id' => $plan->id,
                'plan_slug' => $plan->slug,
            ]);

            return $user;
        });
    }
}
