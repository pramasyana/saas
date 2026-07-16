<?php

declare(strict_types=1);

namespace App\Modules\Financing\Providers;

use App\Modules\Financing\Contracts\CostCategoryRepositoryInterface;
use App\Modules\Financing\Contracts\CostRepositoryInterface;
use App\Modules\Financing\Repositories\CostCategoryRepository;
use App\Modules\Financing\Repositories\CostRepository;
use App\Modules\Financing\Services\FinancingService;
use Illuminate\Support\ServiceProvider;

class FinancingServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(CostRepositoryInterface::class, CostRepository::class);
        $this->app->bind(CostCategoryRepositoryInterface::class, CostCategoryRepository::class);
        $this->app->singleton(FinancingService::class);
    }
}
