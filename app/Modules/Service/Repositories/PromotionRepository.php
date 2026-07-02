<?php

declare(strict_types=1);

namespace App\Modules\Service\Repositories;

use App\Modules\Service\Contracts\PromotionRepositoryInterface;
use App\Modules\Service\Models\Promotion;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class PromotionRepository implements PromotionRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Promotion::where('tenant_id', $tenantId);

        if (! empty($filters['search'])) {
            $query->where(function ($q) use ($filters): void {
                $q->where('name', 'like', "%{$filters['search']}%")
                    ->orWhere('code', 'like', "%{$filters['search']}%");
            });
        }

        if (! empty($filters['promotion_type'])) {
            $query->where('promotion_type', $filters['promotion_type']);
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        return $query->orderBy('name')->paginate($perPage);
    }

    public function findAllByTenant(string $tenantId): Collection
    {
        return Promotion::where('tenant_id', $tenantId)
            ->where('is_active', true)
            ->get();
    }

    public function findById(string $id): ?Promotion
    {
        return Promotion::find($id);
    }

    public function findOrFail(string $id): Promotion
    {
        return Promotion::findOrFail($id);
    }

    public function create(array $data): Promotion
    {
        return Promotion::create($data);
    }

    public function update(Promotion $promotion, array $data): Promotion
    {
        $promotion->update($data);

        return $promotion;
    }

    public function delete(Promotion $promotion): bool
    {
        return $promotion->delete();
    }

    public function findByCode(string $tenantId, string $code): ?Promotion
    {
        return Promotion::where('tenant_id', $tenantId)
            ->where('code', $code)
            ->where('is_active', true)
            ->first();
    }

    public function countByTenant(string $tenantId): int
    {
        return Promotion::where('tenant_id', $tenantId)->count();
    }

    public function countActiveByTenant(string $tenantId): int
    {
        return Promotion::where('tenant_id', $tenantId)
            ->where('is_active', true)
            ->count();
    }
}
