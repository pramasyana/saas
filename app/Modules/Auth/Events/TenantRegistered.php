<?php

declare(strict_types=1);

namespace App\Modules\Auth\Events;

use App\Models\Tenant;
use App\Models\User;

class TenantRegistered
{
    public function __construct(
        public readonly User $user,
        public readonly Tenant $tenant,
    ) {}
}
