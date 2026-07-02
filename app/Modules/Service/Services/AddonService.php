<?php

declare(strict_types=1);

namespace App\Modules\Service\Services;

use App\Modules\Service\Contracts\AddonRepositoryInterface;
use App\Modules\Service\Models\Addon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class AddonService
{
    public function __construct(
        private readonly AddonRepositoryInterface $addonRepository,
    ) {}

    public function getTenantId(): string
    {
        return auth()->user()->tenant_id;
    }

    public function paginate(array $filters = [], ?string $branchId = null, int $perPage = 15): LengthAwarePaginator
    {
        return $this->addonRepository->paginate($this->getTenantId(), $filters, $branchId, $perPage);
    }

    public function findAll(?string $branchId = null): Collection
    {
        return $this->addonRepository->findAllByTenant($this->getTenantId(), $branchId);
    }

    public function findById(string $id): Addon
    {
        return $this->addonRepository->findOrFail($id);
    }

    public function create(array $data): Addon
    {
        return DB::transaction(function () use ($data) {
            return $this->addonRepository->create(array_merge($data, [
                'tenant_id' => $this->getTenantId(),
            ]));
        });
    }

    public function update(string $id, array $data): Addon
    {
        return DB::transaction(function () use ($id, $data) {
            $addon = $this->addonRepository->findOrFail($id);

            return $this->addonRepository->update($addon, $data);
        });
    }

    public function delete(string $id): void
    {
        DB::transaction(function () use ($id) {
            $addon = $this->addonRepository->findOrFail($id);
            $this->addonRepository->delete($addon);
        });
    }

    public function getStats(): array
    {
        $tenantId = $this->getTenantId();

        return [
            'total' => $this->addonRepository->countByTenant($tenantId),
            'active' => $this->addonRepository->countActiveByTenant($tenantId),
        ];
    }
}
