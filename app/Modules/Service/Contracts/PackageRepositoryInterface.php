<?php

declare(strict_types=1);

namespace App\Modules\Service\Contracts;

use App\Modules\Service\Models\Package;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface PackageRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findAllByTenant(string $tenantId): Collection;

    public function findById(string $id): ?Package;

    public function findOrFail(string $id): Package;

    public function create(array $data): Package;

    public function update(Package $package, array $data): Package;

    public function delete(Package $package): bool;

    public function syncServices(Package $package, array $services): void;

    public function countByTenant(string $tenantId): int;

    public function countActiveByTenant(string $tenantId): int;
}
