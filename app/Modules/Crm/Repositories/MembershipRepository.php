<?php

declare(strict_types=1);

namespace App\Modules\Crm\Repositories;

use App\Modules\Crm\Contracts\MembershipRepositoryInterface;
use App\Modules\Crm\Models\Membership;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class MembershipRepository implements MembershipRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Membership::where('tenant_id', $tenantId);

        if (! empty($filters['customer_id'])) {
            $query->where('customer_id', $filters['customer_id']);
        }

        if (! empty($filters['membership_tier_id'])) {
            $query->where('membership_tier_id', $filters['membership_tier_id']);
        }

        return $query->orderBy('joined_at', 'desc')->paginate($perPage);
    }

    public function findAllByTenant(string $tenantId): Collection
    {
        return Membership::where('tenant_id', $tenantId)
            ->orderBy('joined_at', 'desc')
            ->get();
    }

    public function findById(string $id): ?Membership
    {
        return Membership::find($id);
    }

    public function findOrFail(string $id): Membership
    {
        return Membership::findOrFail($id);
    }

    public function create(array $data): Membership
    {
        return Membership::create($data);
    }

    public function update(Membership $membership, array $data): Membership
    {
        $membership->update($data);

        return $membership;
    }

    public function delete(Membership $membership): bool
    {
        return $membership->delete();
    }

    public function countByTenant(string $tenantId): int
    {
        return Membership::where('tenant_id', $tenantId)->count();
    }

    public function findByCustomer(string $customerId): ?Membership
    {
        return Membership::where('customer_id', $customerId)->first();
    }
}
