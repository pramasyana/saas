<?php

declare(strict_types=1);

namespace App\Modules\Service\Services;

use App\Modules\Service\Contracts\PackageRepositoryInterface;
use App\Modules\Service\Models\Package;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class PackageService
{
    public function __construct(
        private readonly PackageRepositoryInterface $packageRepository,
    ) {}

    public function getTenantId(): string
    {
        return auth()->user()->tenant_id;
    }

    public function paginate(array $filters = [], ?string $branchId = null, int $perPage = 15): LengthAwarePaginator
    {
        return $this->packageRepository->paginate($this->getTenantId(), $filters, $branchId, $perPage);
    }

    public function findAll(?string $branchId = null): Collection
    {
        return $this->packageRepository->findAllByTenant($this->getTenantId(), $branchId);
    }

    public function findById(string $id): Package
    {
        return $this->packageRepository->findOrFail($id);
    }

    public function create(array $data): Package
    {
        return DB::transaction(function () use ($data) {
            $package = $this->packageRepository->create([
                'tenant_id' => $this->getTenantId(),
                'branch_id' => $data['branch_id'],
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'price' => $data['price'],
                'duration' => $data['duration'] ?? 0,
                'is_active' => $data['is_active'] ?? true,
            ]);

            if (! empty($data['services'])) {
                $this->packageRepository->syncServices($package, $data['services']);
            }

            return $package->load('services');
        });
    }

    public function update(string $id, array $data): Package
    {
        return DB::transaction(function () use ($id, $data) {
            $package = $this->packageRepository->findOrFail($id);
            $this->packageRepository->update($package, $data);

            if (array_key_exists('services', $data)) {
                $this->packageRepository->syncServices($package, $data['services'] ?? []);
            }

            return $package->fresh()->load('services');
        });
    }

    public function delete(string $id): void
    {
        DB::transaction(function () use ($id) {
            $package = $this->packageRepository->findOrFail($id);
            $this->packageRepository->delete($package);
        });
    }

    public function getStats(): array
    {
        $tenantId = $this->getTenantId();

        return [
            'total' => $this->packageRepository->countByTenant($tenantId),
            'active' => $this->packageRepository->countActiveByTenant($tenantId),
        ];
    }
}
