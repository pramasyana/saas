<?php

declare(strict_types=1);

namespace App\Modules\Service\Services;

use App\Modules\Service\Contracts\PricingRuleRepositoryInterface;
use App\Modules\Service\Models\PricingRule;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class PricingRuleService
{
    public function __construct(
        private readonly PricingRuleRepositoryInterface $pricingRuleRepository,
    ) {}

    public function getTenantId(): string
    {
        return auth()->user()->tenant_id;
    }

    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->pricingRuleRepository->paginate($this->getTenantId(), $filters, $perPage);
    }

    public function findById(string $id): PricingRule
    {
        return $this->pricingRuleRepository->findOrFail($id);
    }

    public function create(array $data): PricingRule
    {
        return DB::transaction(function () use ($data) {
            return $this->pricingRuleRepository->create(array_merge($data, [
                'tenant_id' => $this->getTenantId(),
            ]));
        });
    }

    public function update(string $id, array $data): PricingRule
    {
        return DB::transaction(function () use ($id, $data) {
            $rule = $this->pricingRuleRepository->findOrFail($id);

            return $this->pricingRuleRepository->update($rule, $data);
        });
    }

    public function delete(string $id): void
    {
        DB::transaction(function () use ($id) {
            $rule = $this->pricingRuleRepository->findOrFail($id);
            $this->pricingRuleRepository->delete($rule);
        });
    }

    public function getStats(): array
    {
        $tenantId = $this->getTenantId();

        return [
            'total' => $this->pricingRuleRepository->countByTenant($tenantId),
            'active' => $this->pricingRuleRepository->countActiveByTenant($tenantId),
            'scheduled' => $this->pricingRuleRepository->countScheduledByTenant($tenantId),
        ];
    }
}
