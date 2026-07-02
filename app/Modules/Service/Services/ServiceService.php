<?php

declare(strict_types=1);

namespace App\Modules\Service\Services;

use App\Modules\Service\Contracts\ServiceRepositoryInterface;
use App\Modules\Service\Models\Service;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ServiceService
{
    public function __construct(
        private readonly ServiceRepositoryInterface $serviceRepository,
    ) {}

    public function getTenantId(): string
    {
        return auth()->user()->tenant_id;
    }

    public function paginate(array $filters = [], ?string $branchId = null, int $perPage = 15): LengthAwarePaginator
    {
        return $this->serviceRepository->paginate($this->getTenantId(), $filters, $branchId, $perPage);
    }

    public function findAll(?string $branchId = null): Collection
    {
        return $this->serviceRepository->findAllByTenant($this->getTenantId(), $branchId);
    }

    public function findById(string $id): Service
    {
        return $this->serviceRepository->findOrFail($id);
    }

    public function create(array $data): Service
    {
        return DB::transaction(function () use ($data) {
            return $this->serviceRepository->create(array_merge($data, [
                'tenant_id' => $this->getTenantId(),
            ]));
        });
    }

    public function update(string $id, array $data): Service
    {
        return DB::transaction(function () use ($id, $data) {
            $service = $this->serviceRepository->findOrFail($id);

            return $this->serviceRepository->update($service, $data);
        });
    }

    public function delete(string $id): void
    {
        DB::transaction(function () use ($id) {
            $service = $this->serviceRepository->findOrFail($id);
            $this->serviceRepository->delete($service);
        });
    }

    public function getStats(): array
    {
        $tenantId = $this->getTenantId();

        return [
            'total' => $this->serviceRepository->countByTenant($tenantId),
            'active' => $this->serviceRepository->countActiveByTenant($tenantId),
        ];
    }
}
