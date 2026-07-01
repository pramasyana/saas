<?php

declare(strict_types=1);

namespace App\Modules\Company\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Cache;

class ClearCompanyCache implements ShouldQueue
{
    public function handle(object $event): void
    {
        $tenantId = $event->tenantId ?? null;

        if ($tenantId) {
            Cache::forget("company_profile_{$tenantId}");
            Cache::forget("company_branding_{$tenantId}");
            Cache::forget("company_branches_{$tenantId}");
            Cache::forget("company_working_hours_{$tenantId}");
            Cache::forget("company_holidays_{$tenantId}");
        }
    }
}
