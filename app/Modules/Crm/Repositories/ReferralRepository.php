<?php

declare(strict_types=1);

namespace App\Modules\Crm\Repositories;

use App\Modules\Crm\Contracts\ReferralRepositoryInterface;
use App\Modules\Crm\Models\Referral;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ReferralRepository implements ReferralRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Referral::where('tenant_id', $tenantId);

        if (! empty($filters['referrer_customer_id'])) {
            $query->where('referrer_customer_id', $filters['referrer_customer_id']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function findAllByTenant(string $tenantId): Collection
    {
        return Referral::where('tenant_id', $tenantId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function findById(string $id): ?Referral
    {
        return Referral::find($id);
    }

    public function findOrFail(string $id): Referral
    {
        return Referral::findOrFail($id);
    }

    public function create(array $data): Referral
    {
        return Referral::create($data);
    }

    public function update(Referral $referral, array $data): Referral
    {
        $referral->update($data);

        return $referral;
    }

    public function delete(Referral $referral): bool
    {
        return $referral->delete();
    }

    public function countByTenant(string $tenantId): int
    {
        return Referral::where('tenant_id', $tenantId)->count();
    }

    public function findByReferrer(string $referrerCustomerId): Collection
    {
        return Referral::where('referrer_customer_id', $referrerCustomerId)
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
