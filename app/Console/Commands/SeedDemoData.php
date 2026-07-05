<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\Tenant;
use Database\Seeders\DemoDataSeeder;
use Illuminate\Console\Command;

class SeedDemoData extends Command
{
    protected $signature = 'demo:seed {tenant? : Tenant ID spesifik}';

    protected $description = 'Seed demo data (rooms, customers, membership plans, bookings) into tenant(s)';

    public function handle(): void
    {
        $tenantId = $this->argument('tenant');

        $tenants = $tenantId
            ? Tenant::where('id', $tenantId)->get()
            : Tenant::all();

        if ($tenants->isEmpty()) {
            $this->warn('No tenants found.');

            return;
        }

        $seeder = new DemoDataSeeder;

        foreach ($tenants as $tenant) {
            $tenant->run(function () use ($seeder) {
                $seeder->run();
            });

            $this->info("Seeded demo data for tenant: {$tenant->getInternal('name')} ({$tenant->id})");
        }
    }
}
