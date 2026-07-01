<?php

declare(strict_types=1);

namespace App\Modules\Company\Policies;

use App\Models\User;

class CompanyPolicy
{
    public function view(User $user): bool
    {
        return $user->tenant_id !== null;
    }

    public function update(User $user): bool
    {
        return $user->tenant_id !== null;
    }
}
