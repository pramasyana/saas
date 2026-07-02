<?php

declare(strict_types=1);

namespace App\Modules\Crm\Repositories;

use App\Modules\Crm\Contracts\RewardRedemptionRepositoryInterface;
use App\Modules\Crm\Models\RewardRedemption;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class RewardRedemptionRepository implements RewardRedemptionRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = RewardRedemption::where('tenant_id', $tenantId);

        if (! empty($filters['customer_id'])) {
            $query->where('customer_id', $filters['customer_id']);
        }

        if (! empty($filters['reward_id'])) {
            $query->where('reward_id', $filters['reward_id']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function findAllByTenant(string $tenantId): Collection
    {
        return RewardRedemption::where('tenant_id', $tenantId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function findById(string $id): ?RewardRedemption
    {
        return RewardRedemption::find($id);
    }

    public function findOrFail(string $id): RewardRedemption
    {
        return RewardRedemption::findOrFail($id);
    }

    public function create(array $data): RewardRedemption
    {
        return RewardRedemption::create($data);
    }

    public function update(RewardRedemption $rewardRedemption, array $data): RewardRedemption
    {
        $rewardRedemption->update($data);

        return $rewardRedemption;
    }

    public function delete(RewardRedemption $rewardRedemption): bool
    {
        return $rewardRedemption->delete();
    }

    public function findByCustomer(string $customerId): Collection
    {
        return RewardRedemption::where('customer_id', $customerId)
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
