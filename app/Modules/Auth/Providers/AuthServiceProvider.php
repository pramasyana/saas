<?php

namespace App\Modules\Auth\Providers;

use App\Modules\Auth\Contracts\AuthUserRepositoryInterface;
use App\Modules\Auth\Events\TenantRegistered;
use App\Modules\Auth\Listeners\SendVerificationNotification;
use App\Modules\Auth\Repositories\AuthUserRepository;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $listen = [
        TenantRegistered::class => [
            SendVerificationNotification::class,
        ],
    ];

    public function register(): void
    {
        parent::register();

        $this->app->bind(AuthUserRepositoryInterface::class, AuthUserRepository::class);
    }

    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
