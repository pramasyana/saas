<?php

declare(strict_types=1);

namespace App\Modules\Staff\Repositories;

use App\Modules\Staff\Contracts\StaffRepositoryInterface;
use App\Modules\Staff\Models\Staff;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class StaffRepository implements StaffRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Staff::where('tenant_id', $tenantId);

        if (! empty($filters['search'])) {
            $query->where(function ($q) use ($filters): void {
                $q->where('name', 'like', "%{$filters['search']}%")
                    ->orWhere('email', 'like', "%{$filters['search']}%")
                    ->orWhere('phone', 'like', "%{$filters['search']}%");
            });
        }

        if (isset($filters['branch_id']) && $filters['branch_id'] !== '') {
            $query->where(function ($q) use ($filters): void {
                $q->where('branch_id', $filters['branch_id'])
                    ->orWhereNull('branch_id');
            });
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        return $query->orderBy('name')->paginate($perPage);
    }

    public function findAllByTenant(string $tenantId): Collection
    {
        return Staff::where('tenant_id', $tenantId)
            ->where('is_active', true)
            ->orderBy('name')
            ->get();
    }

    public function findById(string $id): ?Staff
    {
        return Staff::find($id);
    }

    public function findOrFail(string $id): Staff
    {
        return Staff::findOrFail($id);
    }

    public function create(array $data): Staff
    {
        return Staff::create($data);
    }

    public function update(Staff $staff, array $data): Staff
    {
        $staff->update($data);

        return $staff;
    }

    public function delete(Staff $staff): bool
    {
        return $staff->delete();
    }

    public function countByTenant(string $tenantId): int
    {
        return Staff::where('tenant_id', $tenantId)->count();
    }

    public function countActiveByTenant(string $tenantId): int
    {
        return Staff::where('tenant_id', $tenantId)->where('is_active', true)->count();
    }
}
