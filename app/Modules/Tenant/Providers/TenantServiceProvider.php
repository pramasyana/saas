<?php

declare(strict_types=1);

namespace App\Modules\Tenant\Providers;

use App\Modules\Tenant\Contracts\TenantRepositoryInterface;
use App\Modules\Tenant\Repositories\TenantRepository;
use Illuminate\Support\ServiceProvider;

class TenantServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(TenantRepositoryInterface::class, TenantRepository::class);
    }
}
