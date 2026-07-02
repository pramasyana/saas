<?php

declare(strict_types=1);

namespace App\Modules\Service\Repositories;

use App\Modules\Service\Contracts\CategoryRepositoryInterface;
use App\Modules\Service\Models\Category;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class CategoryRepository implements CategoryRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], ?string $branchId = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = Category::where('tenant_id', $tenantId);

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

        return $query->orderBy('sort_order')->orderBy('name')->paginate($perPage);
    }

    public function findAllByTenant(string $tenantId, ?string $branchId = null): Collection
    {
        $query = Category::where('tenant_id', $tenantId)
            ->where('is_active', true);

        if ($branchId !== null) {
            $query->where('branch_id', $branchId);
        }

        return $query
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();
    }

    public function findById(string $id): ?Category
    {
        return Category::find($id);
    }

    public function findOrFail(string $id): Category
    {
        return Category::findOrFail($id);
    }

    public function create(array $data): Category
    {
        return Category::create($data);
    }

    public function update(Category $category, array $data): Category
    {
        $category->update($data);

        return $category;
    }

    public function delete(Category $category): bool
    {
        return $category->delete();
    }

    public function countByTenant(string $tenantId): int
    {
        return Category::where('tenant_id', $tenantId)->count();
    }

    public function countActiveByTenant(string $tenantId): int
    {
        return Category::where('tenant_id', $tenantId)
            ->where('is_active', true)
            ->count();
    }
}
