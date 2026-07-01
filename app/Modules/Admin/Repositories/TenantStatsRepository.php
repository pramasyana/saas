<?php

namespace App\Modules\Admin\Repositories;

use App\Models\Tenant;
use App\Modules\Admin\Contracts\TenantStatsRepositoryInterface;

class TenantStatsRepository implements TenantStatsRepositoryInterface
{
    public function count(): int
    {
        return Tenant::count();
    }

    public function countWhereBetween(string $column, array $dates): int
    {
        return Tenant::whereBetween($column, $dates)->count();
    }
}
