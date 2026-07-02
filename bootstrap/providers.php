<?php

use App\Modules\Admin\Providers\AdminServiceProvider;
use App\Modules\Auth\Providers\AuthServiceProvider;
use App\Modules\Company\Providers\CompanyServiceProvider;
use App\Modules\Crm\Providers\CrmServiceProvider;
use App\Modules\Notification\Providers\NotificationServiceProvider;
use App\Modules\Pricing\Providers\PricingServiceProvider;
use App\Modules\Staff\Providers\StaffServiceProvider;
use App\Modules\Subscription\Providers\SubscriptionServiceProvider;
use App\Modules\Tenant\Providers\TenantServiceProvider;
use App\Providers\AppServiceProvider;

return [
    AuthServiceProvider::class,
    AppServiceProvider::class,
    CrmServiceProvider::class,
    AdminServiceProvider::class,
    CompanyServiceProvider::class,
    NotificationServiceProvider::class,
    PricingServiceProvider::class,
    StaffServiceProvider::class,
    SubscriptionServiceProvider::class,
    TenantServiceProvider::class,
];
