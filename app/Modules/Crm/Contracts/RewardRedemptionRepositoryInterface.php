<?php

declare(strict_types=1);

namespace App\Modules\Crm\Contracts;

use App\Modules\Crm\Models\RewardRedemption;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface RewardRedemptionRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findAllByTenant(string $tenantId): Collection;

    public function findById(string $id): ?RewardRedemption;

    public function findOrFail(string $id): RewardRedemption;

    public function create(array $data): RewardRedemption;

    public function update(RewardRedemption $rewardRedemption, array $data): RewardRedemption;

    public function delete(RewardRedemption $rewardRedemption): bool;

    public function findByCustomer(string $customerId): Collection;
}
