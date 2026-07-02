<?php

declare(strict_types=1);

namespace App\Modules\Service\Repositories;

use App\Modules\Service\Contracts\PricingRuleRepositoryInterface;
use App\Modules\Service\Models\PricingRule;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class PricingRuleRepository implements PricingRuleRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], ?string $branchId = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = PricingRule::where('tenant_id', $tenantId);

        if ($branchId !== null) {
            $query->where('branch_id', $branchId);
        }

        if (! empty($filters['search'])) {
            $query->where(function ($q) use ($filters): void {
                $q->where('name', 'like', "%{$filters['search']}%");
            });
        }

        if (isset($filters['action_type'])) {
            $query->where('action_type', $filters['action_type']);
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        return $query->orderBy('priority')->orderBy('name')->paginate($perPage);
    }

    public function findAllByTenant(string $tenantId, ?string $branchId = null): Collection
    {
        $query = PricingRule::where('tenant_id', $tenantId)
            ->where('is_active', true);

        if ($branchId !== null) {
            $query->where('branch_id', $branchId);
        }

        return $query
            ->orderBy('priority')
            ->get();
    }

    public function findById(string $id): ?PricingRule
    {
        return PricingRule::find($id);
    }

    public function findOrFail(string $id): PricingRule
    {
        return PricingRule::findOrFail($id);
    }

    public function create(array $data): PricingRule
    {
        return PricingRule::create($data);
    }

    public function update(PricingRule $pricingRule, array $data): PricingRule
    {
        $pricingRule->update($data);

        return $pricingRule;
    }

    public function delete(PricingRule $pricingRule): bool
    {
        return $pricingRule->delete();
    }

    public function countByTenant(string $tenantId): int
    {
        return PricingRule::where('tenant_id', $tenantId)->count();
    }

    public function getActiveRules(string $tenantId): Collection
    {
        return PricingRule::where('tenant_id', $tenantId)
            ->where('is_active', true)
            ->where(function ($q): void {
                $q->whereNull('start_date')
                    ->orWhere('start_date', '<=', now()->format('Y-m-d'));
            })
            ->where(function ($q): void {
                $q->whereNull('end_date')
                    ->orWhere('end_date', '>=', now()->format('Y-m-d'));
            })
            ->orderBy('priority')
            ->get();
    }

    public function countActiveByTenant(string $tenantId): int
    {
        return PricingRule::where('tenant_id', $tenantId)
            ->where('is_active', true)
            ->where(function ($q): void {
                $q->whereNull('start_date')
                    ->orWhere('start_date', '<=', now()->format('Y-m-d'));
            })
            ->where(function ($q): void {
                $q->whereNull('end_date')
                    ->orWhere('end_date', '>=', now()->format('Y-m-d'));
            })
            ->count();
    }

    public function countScheduledByTenant(string $tenantId): int
    {
        return PricingRule::where('tenant_id', $tenantId)
            ->where('is_active', true)
            ->whereNotNull('start_date')
            ->where('start_date', '>', now()->format('Y-m-d'))
            ->count();
    }
}
