<?php

namespace Database\Seeders;

use App\Modules\Pricing\Database\Seeders\FeatureDefinitionSeeder;
use App\Modules\Pricing\Database\Seeders\PlanSeeder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            FeatureDefinitionSeeder::class,
            PlanSeeder::class,
        ]);
    }
}
