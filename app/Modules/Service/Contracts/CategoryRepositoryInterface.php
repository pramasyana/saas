<?php

declare(strict_types=1);

namespace App\Modules\Service\Contracts;

use App\Modules\Service\Models\Category;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface CategoryRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], ?string $branchId = null, int $perPage = 15): LengthAwarePaginator;

    public function findAllByTenant(string $tenantId, ?string $branchId = null): Collection;

    public function findById(string $id): ?Category;

    public function findOrFail(string $id): Category;

    public function create(array $data): Category;

    public function update(Category $category, array $data): Category;

    public function delete(Category $category): bool;

    public function countByTenant(string $tenantId): int;

    public function countActiveByTenant(string $tenantId): int;
}
