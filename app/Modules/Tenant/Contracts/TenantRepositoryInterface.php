<?php

declare(strict_types=1);

namespace App\Modules\Tenant\Contracts;

use App\Models\Tenant;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface TenantRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findById(string $id): ?Tenant;

    public function create(array $data): Tenant;

    public function update(Tenant $tenant, array $data): Tenant;

    public function delete(Tenant $tenant): bool;

    /** @return array{total: int, with_domains: int} */
    public function getStats(): array;

    public function findByIdWithRelations(string $id): ?Tenant;
}
