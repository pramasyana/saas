<?php

declare(strict_types=1);

namespace App\Modules\Auth\Listeners;

use App\Modules\Auth\Events\TenantRegistered;
use App\Modules\Company\Models\Branch;

class CreateDefaultBranch
{
    public function handle(TenantRegistered $event): void
    {
        Branch::create([
            'tenant_id' => $event->tenant->id,
            'name' => 'Utama',
            'slug' => 'utama',
            'is_default' => true,
            'is_active' => true,
        ]);
    }
}
