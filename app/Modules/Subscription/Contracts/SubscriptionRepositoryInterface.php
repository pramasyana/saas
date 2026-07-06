<?php

namespace App\Modules\Subscription\Contracts;

use App\Modules\Subscription\Models\Subscription;
use Illuminate\Pagination\LengthAwarePaginator;

interface SubscriptionRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findById(string $id): ?Subscription;

    public function create(array $data): Subscription;

    public function update(Subscription $subscription, array $data): Subscription;

    public function delete(Subscription $subscription): void;

    /** @return array{active: int, cancelled: int, total_revenue: float} */
    public function getStats(): array;

    /** @return array{active: int, cancelled: int, total_revenue: float} */
    public function getStatsByTenant(string $tenantId): array;

    public function findByTenantId(string $tenantId): ?Subscription;
}
