<?php

namespace Database\Seeders;

use App\Models\Tenant;
use App\Models\User;
use App\Modules\Auth\Events\TenantRegistered;
use App\Modules\Company\Models\Branch;
use App\Modules\Pricing\Database\Seeders\FeatureDefinitionSeeder;
use App\Modules\Pricing\Database\Seeders\PlanSeeder;
use App\Modules\Pricing\Models\Plan;
use App\Modules\Setting\Database\Seeders\TenantSettingSeeder;
use App\Modules\Subscription\Services\SubscriptionService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            FeatureDefinitionSeeder::class,
            PlanSeeder::class,
        ]);

        $this->createAdminUser();
    }

    private function createAdminUser(): void
    {
        DB::transaction(function () {
            $user = User::create([
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'password' => bcrypt('password'),
                'is_admin' => true,
                'is_active' => true,
                'email_verified_at' => now(),
            ]);

            $tenant = Tenant::create([
                'user_id' => $user->id,
            ]);

            $tenant->setInternal('name', 'Demo Company');
            $tenant->setInternal('email', 'admin@example.com');
            $tenant->setInternal('phone', '08123456789');
            $tenant->save();

            $tenant->domains()->create([
                'domain' => 'demo.localhost',
            ]);

            $user->update(['tenant_id' => $tenant->id]);

            $plan = Plan::where('slug', 'free')->first();

            if ($plan) {
                app(SubscriptionService::class)->subscribe([
                    'user_id' => $user->id,
                    'tenant_id' => $tenant->id,
                    'plan_id' => $plan->id,
                    'billing_interval' => 'monthly',
                ]);
            }

            event(new TenantRegistered($user, $tenant));

            $branch = Branch::where('tenant_id', $tenant->id)->where('is_default', true)->first();

            tenancy()->initialize($tenant);

            if ($branch) {
                $this->call(ServiceSeeder::class, parameters: [
                    'tenantId' => $tenant->id,
                    'branchId' => $branch->id,
                ]);

                $this->call(AvailabilitySeeder::class, parameters: [
                    'tenantId' => $tenant->id,
                    'branchId' => $branch->id,
                ]);

                $this->call(TenantSettingSeeder::class);
            }
        });
    }
}
