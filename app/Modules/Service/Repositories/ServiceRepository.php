<?php

declare(strict_types=1);

namespace App\Modules\Service\Repositories;

use App\Modules\Service\Contracts\ServiceRepositoryInterface;
use App\Modules\Service\Models\Service;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ServiceRepository implements ServiceRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], ?string $branchId = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = Service::where('tenant_id', $tenantId);

        if ($branchId !== null) {
            $query->where('branch_id', $branchId);
        }

        if (! empty($filters['search'])) {
            $query->where(function ($q) use ($filters): void {
                $q->where('name', 'like', "%{$filters['search']}%");
            });
        }

        if (! empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        return $query->with('category')
            ->orderBy('name')
            ->paginate($perPage);
    }

    public function findAllByTenant(string $tenantId, ?string $branchId = null): Collection
    {
        $query = Service::where('tenant_id', $tenantId)
            ->where('is_active', true);

        if ($branchId !== null) {
            $query->where('branch_id', $branchId);
        }

        return $query
            ->with('category')
            ->orderBy('name')
            ->get();
    }

    public function findById(string $id): ?Service
    {
        return Service::with('category')->find($id);
    }

    public function findOrFail(string $id): Service
    {
        return Service::with('category')->findOrFail($id);
    }

    public function create(array $data): Service
    {
        return Service::create($data);
    }

    public function update(Service $service, array $data): Service
    {
        $service->update($data);

        return $service;
    }

    public function delete(Service $service): bool
    {
        return $service->delete();
    }

    public function countByTenant(string $tenantId): int
    {
        return Service::where('tenant_id', $tenantId)->count();
    }

    public function countActiveByTenant(string $tenantId): int
    {
        return Service::where('tenant_id', $tenantId)->where('is_active', true)->count();
    }
}
