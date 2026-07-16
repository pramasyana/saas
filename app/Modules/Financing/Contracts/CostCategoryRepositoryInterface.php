<?php

declare(strict_types=1);

namespace App\Modules\Financing\Contracts;

use App\Modules\Financing\Models\CostCategory;
use Illuminate\Support\Collection;

interface CostCategoryRepositoryInterface
{
    public function paginate(string $tenantId, int $perPage = 15): \Illuminate\Contracts\Pagination\LengthAwarePaginator;

    public function findAllByTenant(string $tenantId): Collection;

    public function findById(string $id): ?CostCategory;

    public function findOrFail(string $id): CostCategory;

    public function create(array $data): CostCategory;

    public function update(CostCategory $category, array $data): CostCategory;

    public function delete(CostCategory $category): bool;

    public function countByTenant(string $tenantId): int;
}
