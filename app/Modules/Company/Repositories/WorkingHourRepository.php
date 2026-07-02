<?php

declare(strict_types=1);

namespace App\Modules\Company\Repositories;

use App\Modules\Company\Contracts\WorkingHourRepositoryInterface;
use App\Modules\Company\Models\WorkingHour;
use Illuminate\Support\Collection;

class WorkingHourRepository implements WorkingHourRepositoryInterface
{
    public function findAllByTenant(string $tenantId, ?string $branchId = null): Collection
    {
        $query = WorkingHour::where('tenant_id', $tenantId);

        if ($branchId !== null) {
            $query->where('branch_id', $branchId);
        }

        return $query->orderBy('day_of_week')->get();
    }

    public function updateOrCreate(string $tenantId, int $dayOfWeek, array $data, ?string $branchId = null): WorkingHour
    {
        return WorkingHour::updateOrCreate(
            [
                'tenant_id' => $tenantId,
                'branch_id' => $branchId,
                'day_of_week' => $dayOfWeek,
            ],
            $data,
        );
    }
}
