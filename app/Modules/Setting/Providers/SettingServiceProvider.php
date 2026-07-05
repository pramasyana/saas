<?php

declare(strict_types=1);

namespace App\Modules\Setting\Providers;

use App\Modules\Setting\Services\TenantSettingService;
use Illuminate\Support\ServiceProvider;

class SettingServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(TenantSettingService::class, function () {
            return new TenantSettingService();
        });
    }

    public function boot(): void
    {
        //
    }
}
