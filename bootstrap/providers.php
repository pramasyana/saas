<?php

use App\Modules\Admin\Providers\AdminServiceProvider;
use App\Modules\Notification\Providers\NotificationServiceProvider;
use App\Modules\Pricing\Providers\PricingServiceProvider;
use App\Providers\AppServiceProvider;

return [
    AppServiceProvider::class,
    AdminServiceProvider::class,
    NotificationServiceProvider::class,
    PricingServiceProvider::class,
];
