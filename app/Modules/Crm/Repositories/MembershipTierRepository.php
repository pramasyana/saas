<?php

declare(strict_types=1);

namespace App\Modules\Crm\Repositories;

use App\Modules\Crm\Contracts\MembershipTierRepositoryInterface;
use App\Modules\Crm\Models\MembershipTier;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class MembershipTierRepository implements MembershipTierRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = MembershipTier::where('tenant_id', $tenantId);

        if (! empty($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        return $query->orderBy('sort_order')->paginate($perPage);
    }

    public function findAllByTenant(string $tenantId): Collection
    {
        return MembershipTier::where('tenant_id', $tenantId)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();
    }

    public function findById(string $id): ?MembershipTier
    {
        return MembershipTier::find($id);
    }

    public function findOrFail(string $id): MembershipTier
    {
        return MembershipTier::findOrFail($id);
    }

    public function create(array $data): MembershipTier
    {
        return MembershipTier::create($data);
    }

    public function update(MembershipTier $membershipTier, array $data): MembershipTier
    {
        $membershipTier->update($data);

        return $membershipTier;
    }

    public function delete(MembershipTier $membershipTier): bool
    {
        return $membershipTier->delete();
    }

    public function countByTenant(string $tenantId): int
    {
        return MembershipTier::where('tenant_id', $tenantId)->count();
    }

    public function countActiveByTenant(string $tenantId): int
    {
        return MembershipTier::where('tenant_id', $tenantId)->where('is_active', true)->count();
    }
}
