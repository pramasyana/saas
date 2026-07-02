<?php

declare(strict_types=1);

namespace App\Modules\Service\Contracts;

use App\Modules\Service\Models\Promotion;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface PromotionRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], ?string $branchId = null, int $perPage = 15): LengthAwarePaginator;

    public function findAllByTenant(string $tenantId, ?string $branchId = null): Collection;

    public function findById(string $id): ?Promotion;

    public function findOrFail(string $id): Promotion;

    public function create(array $data): Promotion;

    public function update(Promotion $promotion, array $data): Promotion;

    public function delete(Promotion $promotion): bool;

    public function findByCode(string $tenantId, string $code): ?Promotion;

    public function countByTenant(string $tenantId): int;

    public function countActiveByTenant(string $tenantId): int;
}
