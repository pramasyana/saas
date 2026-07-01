<?php

namespace App\Modules\Admin\Contracts;

interface TenantStatsRepositoryInterface
{
    public function count(): int;

    public function countWhereBetween(string $column, array $dates): int;
}
