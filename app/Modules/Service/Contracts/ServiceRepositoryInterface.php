<?php

declare(strict_types=1);

namespace App\Modules\Service\Contracts;

use App\Modules\Service\Models\Service;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface ServiceRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], ?string $branchId = null, int $perPage = 15): LengthAwarePaginator;

    public function findAllByTenant(string $tenantId, ?string $branchId = null): Collection;

    public function findById(string $id): ?Service;

    public function findOrFail(string $id): Service;

    public function create(array $data): Service;

    public function update(Service $service, array $data): Service;

    public function delete(Service $service): bool;

    public function countByTenant(string $tenantId): int;

    public function countActiveByTenant(string $tenantId): int;
}
