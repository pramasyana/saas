<?php

declare(strict_types=1);

namespace App\Modules\Crm\Contracts;

use App\Modules\Crm\Models\CustomerMembershipPlan;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface CustomerMembershipPlanRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findAllByTenant(string $tenantId): Collection;

    public function findById(string $id): ?CustomerMembershipPlan;

    public function findOrFail(string $id): CustomerMembershipPlan;

    public function create(array $data): CustomerMembershipPlan;

    public function update(CustomerMembershipPlan $plan, array $data): CustomerMembershipPlan;

    public function delete(CustomerMembershipPlan $plan): bool;

    public function countByTenant(string $tenantId): int;

    public function countActiveByTenant(string $tenantId): int;

    public function countInactiveByTenant(string $tenantId): int;

    public function countSubscribersByTenant(string $tenantId): int;
}
