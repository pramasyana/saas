<?php

declare(strict_types=1);

namespace App\Modules\Crm\Repositories;

use App\Modules\Crm\Contracts\LoyaltyTransactionRepositoryInterface;
use App\Modules\Crm\Models\LoyaltyTransaction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class LoyaltyTransactionRepository implements LoyaltyTransactionRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = LoyaltyTransaction::where('tenant_id', $tenantId);

        if (! empty($filters['customer_id'])) {
            $query->where('customer_id', $filters['customer_id']);
        }

        if (! empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function findAllByTenant(string $tenantId): Collection
    {
        return LoyaltyTransaction::where('tenant_id', $tenantId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function findById(string $id): ?LoyaltyTransaction
    {
        return LoyaltyTransaction::find($id);
    }

    public function findOrFail(string $id): LoyaltyTransaction
    {
        return LoyaltyTransaction::findOrFail($id);
    }

    public function create(array $data): LoyaltyTransaction
    {
        return LoyaltyTransaction::create($data);
    }

    public function update(LoyaltyTransaction $loyaltyTransaction, array $data): LoyaltyTransaction
    {
        $loyaltyTransaction->update($data);

        return $loyaltyTransaction;
    }

    public function delete(LoyaltyTransaction $loyaltyTransaction): bool
    {
        return $loyaltyTransaction->delete();
    }

    public function findByCustomer(string $customerId): Collection
    {
        return LoyaltyTransaction::where('customer_id', $customerId)
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
