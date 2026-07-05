<?php

declare(strict_types=1);

namespace App\Modules\Crm\Contracts;

use App\Modules\Crm\Models\CustomerSubscription;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CustomerSubscriptionRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findById(string $id): ?CustomerSubscription;

    public function findOrFail(string $id): CustomerSubscription;

    public function create(array $data): CustomerSubscription;

    public function update(CustomerSubscription $subscription, array $data): CustomerSubscription;

    public function delete(CustomerSubscription $subscription): bool;

    public function countByTenant(string $tenantId): int;

    public function countByStatus(string $tenantId, string $status): int;

    public function countActiveByTenant(string $tenantId): int;
}
