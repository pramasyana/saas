<?php

declare(strict_types=1);

namespace App\Modules\Booking\Console;

use App\Models\Tenant;
use App\Modules\Company\Models\WorkingHour;
use App\Modules\Staff\Models\Staff;
use Database\Seeders\AvailabilitySeeder;
use Illuminate\Console\Command;

class SeedAvailabilityCommand extends Command
{
    protected $signature = 'availability:seed {tenant? : Tenant ID spesifik} {--force : Seed ulang meskipun sudah ada data}';

    protected $description = 'Seed working hours, staff, schedules, and holidays into existing tenants';

    public function handle(): void
    {
        $tenantId = $this->argument('tenant');
        $force = $this->option('force');

        $tenants = $tenantId
            ? Tenant::where('id', $tenantId)->get()
            : Tenant::all();

        if ($tenants->isEmpty()) {
            $this->warn('No tenants found.');

            return;
        }

        $seeder = new AvailabilitySeeder;

        foreach ($tenants as $tenant) {
            $branch = $tenant->branches()->where('is_default', true)->first();

            if (! $branch) {
                $this->warn("Tenant [{$tenant->getInternal('name')}] has no default branch. Skipping.");

                continue;
            }

            $seeded = false;

            $tenant->run(function () use ($seeder, $tenant, $branch, $force, &$seeded): void {
                $existing = WorkingHour::where('tenant_id', $tenant->id)->count();

                if ($existing > 0 && ! $force) {
                    $this->warn("Tenant [{$tenant->getInternal('name')}] already has availability data. Use --force to re-seed.");

                    return;
                }

                if ($force && $existing > 0) {
                    WorkingHour::where('tenant_id', $tenant->id)->delete();
                    Staff::where('tenant_id', $tenant->id)->delete();
                }

                $seeder->run($tenant->id, $branch->id);
                $seeded = true;
            });

            if ($seeded) {
                $this->info("Seeded availability for tenant: {$tenant->getInternal('name')} ({$tenant->id})");
            }
        }
    }
}
