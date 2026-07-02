<?php

declare(strict_types=1);

namespace App\Modules\Staff\Contracts;

use App\Modules\Staff\Models\Leave;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface LeaveRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findById(string $id): ?Leave;

    public function findOrFail(string $id): Leave;

    public function create(array $data): Leave;

    public function update(Leave $leave, array $data): Leave;

    public function delete(Leave $leave): bool;

    public function countByTenant(string $tenantId): int;

    public function countByStatus(string $tenantId, string $status): int;

    public function countByStaffAndDateRange(string $tenantId, string $staffId, string $start, string $end): int;
}
