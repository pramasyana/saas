<?php

declare(strict_types=1);

namespace App\Modules\Staff\Contracts;

use App\Modules\Staff\Models\Commission;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CommissionRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findById(string $id): ?Commission;

    public function create(array $data): Commission;

    public function update(Commission $commission, array $data): Commission;

    public function delete(Commission $commission): bool;

    public function totalByStaff(string $tenantId, string $staffId, ?string $startDate = null, ?string $endDate = null): float;

    public function totalByTenant(string $tenantId, ?string $startDate = null, ?string $endDate = null): float;

    public function countByTenant(string $tenantId, ?string $startDate = null, ?string $endDate = null): int;

    public function totalByType(string $tenantId, ?string $startDate = null, ?string $endDate = null): array;

    public function getTopStaff(string $tenantId, ?string $startDate = null, ?string $endDate = null, int $limit = 1): array;
}
