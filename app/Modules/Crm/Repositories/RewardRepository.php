<?php

declare(strict_types=1);

namespace App\Modules\Crm\Repositories;

use App\Modules\Crm\Contracts\RewardRepositoryInterface;
use App\Modules\Crm\Models\Reward;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class RewardRepository implements RewardRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Reward::where('tenant_id', $tenantId);

        if (! empty($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        return $query->orderBy('name')->paginate($perPage);
    }

    public function findAllByTenant(string $tenantId): Collection
    {
        return Reward::where('tenant_id', $tenantId)
            ->where('is_active', true)
            ->orderBy('name')
            ->get();
    }

    public function findById(string $id): ?Reward
    {
        return Reward::find($id);
    }

    public function findOrFail(string $id): Reward
    {
        return Reward::findOrFail($id);
    }

    public function create(array $data): Reward
    {
        return Reward::create($data);
    }

    public function update(Reward $reward, array $data): Reward
    {
        $reward->update($data);

        return $reward;
    }

    public function delete(Reward $reward): bool
    {
        return $reward->delete();
    }

    public function countByTenant(string $tenantId): int
    {
        return Reward::where('tenant_id', $tenantId)->count();
    }

    public function countActiveByTenant(string $tenantId): int
    {
        return Reward::where('tenant_id', $tenantId)->where('is_active', true)->count();
    }
}
