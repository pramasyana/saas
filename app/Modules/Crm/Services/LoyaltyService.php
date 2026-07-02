<?php

declare(strict_types=1);

namespace App\Modules\Crm\Services;

use App\Modules\Crm\Contracts\LoyaltyTransactionRepositoryInterface;
use App\Modules\Crm\Contracts\MembershipRepositoryInterface;
use App\Modules\Crm\Contracts\MembershipTierRepositoryInterface;
use App\Modules\Crm\Contracts\RewardRedemptionRepositoryInterface;
use App\Modules\Crm\Contracts\RewardRepositoryInterface;
use App\Modules\Crm\Models\LoyaltyTransaction;
use App\Modules\Crm\Models\Membership;
use App\Modules\Crm\Models\RewardRedemption;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class LoyaltyService
{
    public function __construct(
        private readonly LoyaltyTransactionRepositoryInterface $transactionRepository,
        private readonly MembershipRepositoryInterface $membershipRepository,
        private readonly MembershipTierRepositoryInterface $tierRepository,
        private readonly RewardRepositoryInterface $rewardRepository,
        private readonly RewardRedemptionRepositoryInterface $redemptionRepository,
    ) {}

    public function getTenantId(): string
    {
        return auth()->user()->tenant_id;
    }

    public function getBalance(string $customerId): array
    {
        $membership = $this->membershipRepository->findByCustomer($customerId);

        return [
            'points' => $membership?->points ?? 0,
            'total_spent' => (float) ($membership?->total_spent ?? 0),
        ];
    }

    public function getTransactions(string $customerId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $filters['customer_id'] = $customerId;

        return $this->transactionRepository->paginate($this->getTenantId(), $filters, $perPage);
    }

    public function earnPoints(array $data): LoyaltyTransaction
    {
        return DB::transaction(function () use ($data) {
            $transaction = $this->transactionRepository->create(array_merge($data, [
                'tenant_id' => $this->getTenantId(),
                'type' => 'earn',
            ]));

            $membership = $this->membershipRepository->findByCustomer($data['customer_id']);
            if ($membership) {
                $this->membershipRepository->update($membership, [
                    'points' => $membership->points + $data['points'],
                ]);

                $this->syncTier($membership->fresh());
            }

            return $transaction;
        });
    }

    private function syncTier(Membership $membership): void
    {
        $tiers = $this->tierRepository->findAllByTenant($membership->tenant_id);

        $highestTier = $tiers
            ->where('is_active', true)
            ->sortByDesc('min_points')
            ->first(fn ($t) => $membership->points >= $t->min_points);

        if ($highestTier && $membership->membership_tier_id !== $highestTier->id) {
            $this->membershipRepository->update($membership, [
                'membership_tier_id' => $highestTier->id,
            ]);
        }
    }

    public function spendPoints(array $data): LoyaltyTransaction
    {
        return DB::transaction(function () use ($data) {
            $membership = $this->membershipRepository->findByCustomer($data['customer_id']);
            if (! $membership || $membership->points < $data['points']) {
                throw new \RuntimeException('Insufficient points.');
            }

            $transaction = $this->transactionRepository->create(array_merge($data, [
                'tenant_id' => $this->getTenantId(),
                'type' => 'spend',
            ]));

            $this->membershipRepository->update($membership, [
                'points' => $membership->points - $data['points'],
            ]);

            return $transaction;
        });
    }

    public function redeemReward(array $data): RewardRedemption
    {
        return DB::transaction(function () use ($data) {
            $reward = $this->rewardRepository->findOrFail($data['reward_id']);

            $membership = $this->membershipRepository->findByCustomer($data['customer_id']);
            if (! $membership || $membership->points < $reward->points_required) {
                throw new \RuntimeException('Insufficient points for this reward.');
            }

            if ($reward->stock !== null && $reward->stock <= 0) {
                throw new \RuntimeException('Reward is out of stock.');
            }

            if ($reward->stock !== null) {
                $this->rewardRepository->update($reward, [
                    'stock' => $reward->stock - 1,
                ]);
            }

            $this->membershipRepository->update($membership, [
                'points' => $membership->points - $reward->points_required,
            ]);

            return $this->redemptionRepository->create([
                'tenant_id' => $this->getTenantId(),
                'customer_id' => $data['customer_id'],
                'reward_id' => $reward->id,
                'points_spent' => $reward->points_required,
                'status' => 'completed',
            ]);
        });
    }
}
