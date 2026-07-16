<?php

declare(strict_types=1);

namespace App\Modules\Financing\Contracts;

use App\Modules\Financing\Models\Cost;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CostRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findById(string $id): ?Cost;

    public function findOrFail(string $id): Cost;

    public function create(array $data): Cost;

    public function update(Cost $cost, array $data): Cost;

    public function delete(Cost $cost): bool;

    public function countByTenant(string $tenantId): int;

    public function sumByTenant(string $tenantId, string $startDate, string $endDate): float;

    public function sumByCategory(string $tenantId, string $startDate, string $endDate): array;

    public function getMonthlyCosts(string $tenantId, int $months = 12): array;

    public function bulkInsert(string $tenantId, array $records): int;
}
