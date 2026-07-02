<?php

declare(strict_types=1);

namespace App\Modules\Service\Services;

use App\Modules\Service\Contracts\PromotionRepositoryInterface;
use App\Modules\Service\Models\Promotion;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class PromotionService
{
    public function __construct(
        private readonly PromotionRepositoryInterface $promotionRepository,
    ) {}

    public function getTenantId(): string
    {
        return auth()->user()->tenant_id;
    }

    public function paginate(array $filters = [], ?string $branchId = null, int $perPage = 15): LengthAwarePaginator
    {
        return $this->promotionRepository->paginate($this->getTenantId(), $filters, $branchId, $perPage);
    }

    public function findById(string $id): Promotion
    {
        return $this->promotionRepository->findOrFail($id);
    }

    public function create(array $data): Promotion
    {
        return DB::transaction(function () use ($data) {
            return $this->promotionRepository->create(array_merge($data, [
                'tenant_id' => $this->getTenantId(),
            ]));
        });
    }

    public function update(string $id, array $data): Promotion
    {
        return DB::transaction(function () use ($id, $data) {
            $promotion = $this->promotionRepository->findOrFail($id);

            return $this->promotionRepository->update($promotion, $data);
        });
    }

    public function delete(string $id): void
    {
        DB::transaction(function () use ($id) {
            $promotion = $this->promotionRepository->findOrFail($id);
            $this->promotionRepository->delete($promotion);
        });
    }

    public function getStats(): array
    {
        $tenantId = $this->getTenantId();

        return [
            'total' => $this->promotionRepository->countByTenant($tenantId),
            'active' => $this->promotionRepository->countActiveByTenant($tenantId),
        ];
    }
}
