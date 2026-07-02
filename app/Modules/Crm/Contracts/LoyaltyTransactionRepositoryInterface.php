<?php

declare(strict_types=1);

namespace App\Modules\Crm\Contracts;

use App\Modules\Crm\Models\LoyaltyTransaction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface LoyaltyTransactionRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findAllByTenant(string $tenantId): Collection;

    public function findById(string $id): ?LoyaltyTransaction;

    public function findOrFail(string $id): LoyaltyTransaction;

    public function create(array $data): LoyaltyTransaction;

    public function update(LoyaltyTransaction $loyaltyTransaction, array $data): LoyaltyTransaction;

    public function delete(LoyaltyTransaction $loyaltyTransaction): bool;

    public function findByCustomer(string $customerId): Collection;
}
