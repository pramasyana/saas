<?php

declare(strict_types=1);

namespace App\Modules\Financing\Repositories;

use App\Modules\Financing\Contracts\CostCategoryRepositoryInterface;
use App\Modules\Financing\Models\CostCategory;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class CostCategoryRepository implements CostCategoryRepositoryInterface
{
    public function paginate(string $tenantId, int $perPage = 15): LengthAwarePaginator
    {
        return CostCategory::where('tenant_id', $tenantId)
            ->withCount('costs')
            ->withSum('costs', 'amount')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate($perPage);
    }

    public function findAllByTenant(string $tenantId): Collection
    {
        return CostCategory::where('tenant_id', $tenantId)
            ->withCount('costs')
            ->withSum('costs', 'amount')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();
    }

    public function findById(string $id): ?CostCategory
    {
        return CostCategory::find($id);
    }

    public function findOrFail(string $id): CostCategory
    {
        return CostCategory::findOrFail($id);
    }

    public function create(array $data): CostCategory
    {
        return CostCategory::create($data);
    }

    public function update(CostCategory $category, array $data): CostCategory
    {
        $category->update($data);

        return $category;
    }

    public function delete(CostCategory $category): bool
    {
        return $category->delete();
    }

    public function countByTenant(string $tenantId): int
    {
        return CostCategory::where('tenant_id', $tenantId)->count();
    }
}
