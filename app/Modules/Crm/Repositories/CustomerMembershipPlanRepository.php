<?php

declare(strict_types=1);

namespace App\Modules\Crm\Repositories;

use App\Modules\Crm\Contracts\CustomerMembershipPlanRepositoryInterface;
use App\Modules\Crm\Models\CustomerMembershipPlan;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class CustomerMembershipPlanRepository implements CustomerMembershipPlanRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = CustomerMembershipPlan::where('tenant_id', $tenantId)
            ->withCount('subscriptions');

        if (! empty($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        if (! empty($filters['billing_interval'])) {
            $query->where('billing_interval', $filters['billing_interval']);
        }

        return $query->orderBy('sort_order')->orderBy('name')->paginate($perPage);
    }

    public function findAllByTenant(string $tenantId): Collection
    {
        return CustomerMembershipPlan::where('tenant_id', $tenantId)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();
    }

    public function findById(string $id): ?CustomerMembershipPlan
    {
        return CustomerMembershipPlan::find($id);
    }

    public function findOrFail(string $id): CustomerMembershipPlan
    {
        return CustomerMembershipPlan::findOrFail($id);
    }

    public function create(array $data): CustomerMembershipPlan
    {
        return CustomerMembershipPlan::create($data);
    }

    public function update(CustomerMembershipPlan $plan, array $data): CustomerMembershipPlan
    {
        $plan->update($data);

        return $plan;
    }

    public function delete(CustomerMembershipPlan $plan): bool
    {
        return $plan->delete();
    }

    public function countByTenant(string $tenantId): int
    {
        return CustomerMembershipPlan::where('tenant_id', $tenantId)->count();
    }

    public function countActiveByTenant(string $tenantId): int
    {
        return CustomerMembershipPlan::where('tenant_id', $tenantId)->where('is_active', true)->count();
    }

    public function countInactiveByTenant(string $tenantId): int
    {
        return CustomerMembershipPlan::where('tenant_id', $tenantId)->where('is_active', false)->count();
    }

    public function countSubscribersByTenant(string $tenantId): int
    {
        return CustomerMembershipPlan::where('tenant_id', $tenantId)
            ->withCount('subscriptions')
            ->get()
            ->sum('subscriptions_count');
    }
}
