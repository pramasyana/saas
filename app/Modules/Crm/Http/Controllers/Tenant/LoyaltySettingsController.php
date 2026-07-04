<?php

declare(strict_types=1);

namespace App\Modules\Crm\Http\Controllers\Tenant;

use Inertia\Inertia;
use Inertia\Response;

class LoyaltySettingsController
{
    public function index(): Response
    {
        $config = tenant()->getInternal('loyalty_config') ?? [
            'enabled' => true,
            'mode' => 'percentage',
            'points_per_amount' => 1000,
            'points_fixed' => 10,
        ];

        return Inertia::render('tenant/crm/loyalty/Settings', [
            'title' => 'Pengaturan Loyalty',
            'config' => $config,
        ]);
    }
}
