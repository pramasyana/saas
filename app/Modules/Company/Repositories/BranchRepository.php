<?php

declare(strict_types=1);

namespace App\Modules\Company\Repositories;

use App\Modules\Company\Contracts\BranchRepositoryInterface;
use App\Modules\Company\Models\Branch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class BranchRepository implements BranchRepositoryInterface
{
    public function findAllByTenant(string $tenantId, array $filters = []): LengthAwarePaginator
    {
        $query = Branch::where('tenant_id', $tenantId);

        if (! empty($filters['search'])) {
            $query->where(function ($q) use ($filters): void {
                $q->where('name', 'like', "%{$filters['search']}%")
                    ->orWhere('slug', 'like', "%{$filters['search']}%");
            });
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        $sort = $filters['sort'] ?? 'sort_order';
        $direction = $filters['direction'] ?? 'asc';
        $query->orderBy($sort, $direction);

        $perPage = (int) ($filters['per_page'] ?? 15);

        return $query->paginate($perPage);
    }

    public function findById(string $id): ?Branch
    {
        return Branch::find($id);
    }

    public function findBySlug(string $tenantId, string $slug): ?Branch
    {
        return Branch::where('tenant_id', $tenantId)
            ->where('slug', $slug)
            ->first();
    }

    public function create(array $data): Branch
    {
        return Branch::create($data);
    }

    public function update(Branch $branch, array $data): Branch
    {
        $branch->update($data);

        return $branch;
    }

    public function delete(Branch $branch): void
    {
        $branch->delete();
    }
}
