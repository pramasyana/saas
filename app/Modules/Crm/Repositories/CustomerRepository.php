<?php

declare(strict_types=1);

namespace App\Modules\Crm\Repositories;

use App\Modules\Crm\Contracts\CustomerRepositoryInterface;
use App\Modules\Crm\Models\Customer;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class CustomerRepository implements CustomerRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Customer::where('tenant_id', $tenantId);

        if (! empty($filters['search'])) {
            $query->where(function ($q) use ($filters): void {
                $q->where('name', 'like', "%{$filters['search']}%")
                    ->orWhere('email', 'like', "%{$filters['search']}%")
                    ->orWhere('phone', 'like', "%{$filters['search']}%");
            });
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        if (! empty($filters['tag_id'])) {
            $query->whereHas('tags', fn ($q) => $q->where('tags.id', $filters['tag_id']));
        }

        return $query->orderBy('name')->paginate($perPage);
    }

    public function findAllByTenant(string $tenantId): Collection
    {
        return Customer::where('tenant_id', $tenantId)
            ->where('is_active', true)
            ->orderBy('name')
            ->get();
    }

    public function findById(string $id): ?Customer
    {
        return Customer::find($id);
    }

    public function findOrFail(string $id): Customer
    {
        return Customer::findOrFail($id);
    }

    public function create(array $data): Customer
    {
        return Customer::create($data);
    }

    public function update(Customer $customer, array $data): Customer
    {
        $customer->update($data);

        return $customer;
    }

    public function delete(Customer $customer): bool
    {
        return $customer->delete();
    }

    public function countByTenant(string $tenantId): int
    {
        return Customer::where('tenant_id', $tenantId)->count();
    }

    public function countActiveByTenant(string $tenantId): int
    {
        return Customer::where('tenant_id', $tenantId)->where('is_active', true)->count();
    }

    public function countWithMembershipByTenant(string $tenantId): int
    {
        return Customer::where('tenant_id', $tenantId)
            ->whereHas('membership')
            ->count();
    }

    public function search(string $tenantId, string $term, int $perPage = 15): LengthAwarePaginator
    {
        return Customer::where('tenant_id', $tenantId)
            ->where(function ($q) use ($term): void {
                $q->where('name', 'like', "%{$term}%")
                    ->orWhere('email', 'like', "%{$term}%")
                    ->orWhere('phone', 'like', "%{$term}%");
            })
            ->orderBy('name')
            ->paginate($perPage);
    }

    public function findByEmail(string $tenantId, string $email): ?Customer
    {
        return Customer::where('tenant_id', $tenantId)
            ->where('email', $email)
            ->first();
    }
}
