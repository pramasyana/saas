<?php

declare(strict_types=1);

namespace App\Modules\Crm\Contracts;

use App\Modules\Crm\Models\Referral;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface ReferralRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findAllByTenant(string $tenantId): Collection;

    public function findById(string $id): ?Referral;

    public function findOrFail(string $id): Referral;

    public function create(array $data): Referral;

    public function update(Referral $referral, array $data): Referral;

    public function delete(Referral $referral): bool;

    public function countByTenant(string $tenantId): int;

    public function findByReferrer(string $referrerCustomerId): Collection;
}
