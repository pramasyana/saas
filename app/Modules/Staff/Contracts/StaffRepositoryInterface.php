<?php

declare(strict_types=1);

namespace App\Modules\Staff\Contracts;

use App\Modules\Staff\Models\Staff;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface StaffRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function findAllByTenant(string $tenantId): Collection;
    public function findById(string $id): ?Staff;
    public function findOrFail(string $id): Staff;
    public function create(array $data): Staff;
    public function update(Staff $staff, array $data): Staff;
    public function delete(Staff $staff): bool;
    public function countByTenant(string $tenantId): int;
    public function countActiveByTenant(string $tenantId): int;
}
