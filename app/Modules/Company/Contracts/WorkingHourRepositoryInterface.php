<?php

declare(strict_types=1);

namespace App\Modules\Company\Contracts;

use App\Modules\Company\Models\WorkingHour;
use Illuminate\Support\Collection;

interface WorkingHourRepositoryInterface
{
    public function findAllByTenant(string $tenantId, ?string $branchId = null): Collection;

    public function updateOrCreate(string $tenantId, int $dayOfWeek, array $data, ?string $branchId = null): WorkingHour;
}
