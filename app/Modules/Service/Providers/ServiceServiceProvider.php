<?php

declare(strict_types=1);

namespace App\Modules\Service\Providers;

use App\Modules\Service\Console\SeedServicesCommand;
use App\Modules\Service\Contracts\AddonRepositoryInterface;
use App\Modules\Service\Contracts\CategoryRepositoryInterface;
use App\Modules\Service\Contracts\PackageRepositoryInterface;
use App\Modules\Service\Contracts\PricingRuleRepositoryInterface;
use App\Modules\Service\Contracts\PromotionRepositoryInterface;
use App\Modules\Service\Contracts\ServiceRepositoryInterface;
use App\Modules\Service\Repositories\AddonRepository;
use App\Modules\Service\Repositories\CategoryRepository;
use App\Modules\Service\Repositories\PackageRepository;
use App\Modules\Service\Repositories\PricingRuleRepository;
use App\Modules\Service\Repositories\PromotionRepository;
use App\Modules\Service\Repositories\ServiceRepository;
use Illuminate\Support\ServiceProvider;

class ServiceServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(CategoryRepositoryInterface::class, CategoryRepository::class);
        $this->app->bind(ServiceRepositoryInterface::class, ServiceRepository::class);
        $this->app->bind(PackageRepositoryInterface::class, PackageRepository::class);
        $this->app->bind(AddonRepositoryInterface::class, AddonRepository::class);
        $this->app->bind(PricingRuleRepositoryInterface::class, PricingRuleRepository::class);
        $this->app->bind(PromotionRepositoryInterface::class, PromotionRepository::class);

        $this->commands([
            SeedServicesCommand::class,
        ]);
    }
}
