<?php

declare(strict_types=1);

namespace App\Modules\Service\Contracts;

use App\Modules\Service\Models\PricingRule;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface PricingRuleRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findAllByTenant(string $tenantId): Collection;

    public function findById(string $id): ?PricingRule;

    public function findOrFail(string $id): PricingRule;

    public function create(array $data): PricingRule;

    public function update(PricingRule $pricingRule, array $data): PricingRule;

    public function delete(PricingRule $pricingRule): bool;

    public function countByTenant(string $tenantId): int;

    public function getActiveRules(string $tenantId): Collection;

    public function countActiveByTenant(string $tenantId): int;

    public function countScheduledByTenant(string $tenantId): int;
}
