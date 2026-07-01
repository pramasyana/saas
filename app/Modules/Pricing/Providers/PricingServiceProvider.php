<?php

namespace App\Modules\Pricing\Providers;

use App\Modules\Pricing\Contracts\FeatureDefinitionRepositoryInterface;
use App\Modules\Pricing\Contracts\PlanRepositoryInterface;
use App\Modules\Pricing\Repositories\FeatureDefinitionRepository;
use App\Modules\Pricing\Repositories\PlanRepository;
use Illuminate\Support\ServiceProvider;

class PricingServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(PlanRepositoryInterface::class, PlanRepository::class);
        $this->app->bind(FeatureDefinitionRepositoryInterface::class, FeatureDefinitionRepository::class);
    }
}
