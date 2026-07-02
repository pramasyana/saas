<?php

declare(strict_types=1);

namespace App\Modules\Service\Repositories;

use App\Modules\Service\Contracts\AddonRepositoryInterface;
use App\Modules\Service\Models\Addon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class AddonRepository implements AddonRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], ?string $branchId = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = Addon::where('tenant_id', $tenantId);

        if ($branchId !== null) {
            $query->where('branch_id', $branchId);
        }

        if (! empty($filters['search'])) {
            $query->where(function ($q) use ($filters): void {
                $q->where('name', 'like', "%{$filters['search']}%");
            });
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        return $query->orderBy('name')->paginate($perPage);
    }

    public function findAllByTenant(string $tenantId, ?string $branchId = null): Collection
    {
        $query = Addon::where('tenant_id', $tenantId)
            ->where('is_active', true);

        if ($branchId !== null) {
            $query->where('branch_id', $branchId);
        }

        return $query
            ->orderBy('name')
            ->get();
    }

    public function findById(string $id): ?Addon
    {
        return Addon::find($id);
    }

    public function findOrFail(string $id): Addon
    {
        return Addon::findOrFail($id);
    }

    public function create(array $data): Addon
    {
        return Addon::create($data);
    }

    public function update(Addon $addon, array $data): Addon
    {
        $addon->update($data);

        return $addon;
    }

    public function delete(Addon $addon): bool
    {
        return $addon->delete();
    }

    public function countByTenant(string $tenantId): int
    {
        return Addon::where('tenant_id', $tenantId)->count();
    }

    public function countActiveByTenant(string $tenantId): int
    {
        return Addon::where('tenant_id', $tenantId)
            ->where('is_active', true)
            ->count();
    }
}
