<?php

declare(strict_types=1);

namespace App\Modules\Crm\Services;

use App\Modules\Crm\Contracts\ReferralRepositoryInterface;
use App\Modules\Crm\Models\Referral;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ReferralService
{
    public function __construct(
        private readonly ReferralRepositoryInterface $referralRepository,
    ) {}

    public function getTenantId(): string
    {
        return auth()->user()->tenant_id;
    }

    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->referralRepository->paginate($this->getTenantId(), $filters, $perPage);
    }

    public function create(array $data): Referral
    {
        return DB::transaction(function () use ($data) {
            return $this->referralRepository->create(array_merge($data, [
                'tenant_id' => $this->getTenantId(),
                'code' => Str::random(8),
                'status' => 'pending',
                'reward_given' => false,
            ]));
        });
    }

    public function convert(string $id): Referral
    {
        return DB::transaction(function () use ($id) {
            $referral = $this->referralRepository->findOrFail($id);

            return $this->referralRepository->update($referral, [
                'status' => 'converted',
            ]);
        });
    }

    public function markRewardGiven(string $id): Referral
    {
        return DB::transaction(function () use ($id) {
            $referral = $this->referralRepository->findOrFail($id);

            return $this->referralRepository->update($referral, [
                'reward_given' => true,
                'status' => 'rewarded',
            ]);
        });
    }
}
