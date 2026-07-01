<?php

namespace App\Modules\Subscription\Providers;

use App\Modules\Subscription\Contracts\InvoiceRepositoryInterface;
use App\Modules\Subscription\Contracts\SubscriptionRepositoryInterface;
use App\Modules\Subscription\Repositories\InvoiceRepository;
use App\Modules\Subscription\Repositories\SubscriptionRepository;
use Illuminate\Support\ServiceProvider;

class SubscriptionServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(SubscriptionRepositoryInterface::class, SubscriptionRepository::class);
        $this->app->bind(InvoiceRepositoryInterface::class, InvoiceRepository::class);
    }
}
