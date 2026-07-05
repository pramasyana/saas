<?php

declare(strict_types=1);

namespace App\Modules\Crm\Repositories;

use App\Modules\Crm\Contracts\CustomerSubscriptionRepositoryInterface;
use App\Modules\Crm\Models\CustomerSubscription;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CustomerSubscriptionRepository implements CustomerSubscriptionRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = CustomerSubscription::where('tenant_id', $tenantId)
            ->with(['customer', 'plan']);

        if (! empty($filters['search'])) {
            $query->whereHas('customer', function ($q) use ($filters) {
                $q->where('name', 'like', "%{$filters['search']}%");
            });
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['plan_id'])) {
            $query->where('plan_id', $filters['plan_id']);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function findById(string $id): ?CustomerSubscription
    {
        return CustomerSubscription::with(['customer', 'plan'])->find($id);
    }

    public function findOrFail(string $id): CustomerSubscription
    {
        return CustomerSubscription::with(['customer', 'plan'])->findOrFail($id);
    }

    public function create(array $data): CustomerSubscription
    {
        return CustomerSubscription::create($data);
    }

    public function update(CustomerSubscription $subscription, array $data): CustomerSubscription
    {
        $subscription->update($data);

        return $subscription;
    }

    public function delete(CustomerSubscription $subscription): bool
    {
        return $subscription->delete();
    }

    public function countByTenant(string $tenantId): int
    {
        return CustomerSubscription::where('tenant_id', $tenantId)->count();
    }

    public function countByStatus(string $tenantId, string $status): int
    {
        return CustomerSubscription::where('tenant_id', $tenantId)->where('status', $status)->count();
    }

    public function countActiveByTenant(string $tenantId): int
    {
        return $this->countByStatus($tenantId, 'active');
    }
}
