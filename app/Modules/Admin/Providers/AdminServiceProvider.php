<?php

namespace App\Modules\Admin\Providers;

use App\Modules\Admin\Contracts\UserRepositoryInterface;
use App\Modules\Admin\Repositories\UserRepository;
use Illuminate\Support\ServiceProvider;

class AdminServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
    }
}
