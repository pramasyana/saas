<?php

declare(strict_types=1);

namespace App\Modules\Service\Contracts;

use App\Modules\Service\Models\Addon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface AddonRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findAllByTenant(string $tenantId): Collection;

    public function findById(string $id): ?Addon;

    public function findOrFail(string $id): Addon;

    public function create(array $data): Addon;

    public function update(Addon $addon, array $data): Addon;

    public function delete(Addon $addon): bool;

    public function countByTenant(string $tenantId): int;

    public function countActiveByTenant(string $tenantId): int;
}
