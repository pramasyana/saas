<?php

declare(strict_types=1);

namespace App\Modules\Service\Console;

use App\Models\Tenant;
use App\Modules\Service\Models\Category;
use App\Modules\Service\Models\Service;
use Database\Seeders\ServiceSeeder;
use Illuminate\Console\Command;

class SeedServicesCommand extends Command
{
    protected $signature = 'services:seed {tenant? : Tenant ID spesifik} {--force : Seed ulang meskipun sudah ada data}';

    protected $description = 'Seed service categories and services into existing tenants';

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

        $seeder = new ServiceSeeder;

        foreach ($tenants as $tenant) {
            $branch = $tenant->branches()->where('is_default', true)->first();

            if (! $branch) {
                $this->warn("Tenant [{$tenant->getInternal('name')}] has no default branch. Skipping.");

                continue;
            }

            $seeded = false;

            $tenant->run(function () use ($seeder, $tenant, $branch, $force, &$seeded): void {
                $existing = Service::where('tenant_id', $tenant->id)->count();

                if ($existing > 0 && ! $force) {
                    $this->warn("Tenant [{$tenant->getInternal('name')}] already has {$existing} services. Use --force to re-seed.");

                    return;
                }

                if ($force && $existing > 0) {
                    Service::where('tenant_id', $tenant->id)->delete();
                    Category::where('tenant_id', $tenant->id)->delete();
                }

                $seeder->run($tenant->id, $branch->id);
                $seeded = true;
            });

            if ($seeded) {
                $this->info("Seeded services for tenant: {$tenant->getInternal('name')} ({$tenant->id})");
            }
        }
    }
}
