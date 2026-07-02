<?php

declare(strict_types=1);

namespace App\Modules\Crm\Contracts;

use App\Modules\Crm\Models\Membership;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface MembershipRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findAllByTenant(string $tenantId): Collection;

    public function findById(string $id): ?Membership;

    public function findOrFail(string $id): Membership;

    public function create(array $data): Membership;

    public function update(Membership $membership, array $data): Membership;

    public function delete(Membership $membership): bool;

    public function countByTenant(string $tenantId): int;

    public function findByCustomer(string $customerId): ?Membership;
}
