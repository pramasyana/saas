<?php

declare(strict_types=1);

namespace App\Modules\Service\Repositories;

use App\Modules\Service\Contracts\PackageRepositoryInterface;
use App\Modules\Service\Models\Package;
use App\Modules\Service\Models\PackageService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class PackageRepository implements PackageRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], ?string $branchId = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = Package::where('tenant_id', $tenantId);

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

        return $query->with('services')
            ->orderBy('name')
            ->paginate($perPage);
    }

    public function findAllByTenant(string $tenantId, ?string $branchId = null): Collection
    {
        $query = Package::where('tenant_id', $tenantId)
            ->where('is_active', true);

        if ($branchId !== null) {
            $query->where('branch_id', $branchId);
        }

        return $query
            ->with('services')
            ->get();
    }

    public function findById(string $id): ?Package
    {
        return Package::with('services')->find($id);
    }

    public function findOrFail(string $id): Package
    {
        return Package::with('services')->findOrFail($id);
    }

    public function create(array $data): Package
    {
        return Package::create($data);
    }

    public function update(Package $package, array $data): Package
    {
        $package->update($data);

        return $package;
    }

    public function delete(Package $package): bool
    {
        return $package->delete();
    }

    public function syncServices(Package $package, array $services): void
    {
        $serviceIds = collect($services)->pluck('service_id')->toArray();

        $package->services()->detach();

        foreach ($services as $index => $item) {
            PackageService::create([
                'package_id' => $package->id,
                'service_id' => $item['service_id'],
                'quantity' => $item['quantity'] ?? 1,
                'sort_order' => $item['sort_order'] ?? $index,
            ]);
        }
    }

    public function countByTenant(string $tenantId): int
    {
        return Package::where('tenant_id', $tenantId)->count();
    }

    public function countActiveByTenant(string $tenantId): int
    {
        return Package::where('tenant_id', $tenantId)
            ->where('is_active', true)
            ->count();
    }
}
