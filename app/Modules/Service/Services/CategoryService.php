<?php

declare(strict_types=1);

namespace App\Modules\Service\Services;

use App\Modules\Service\Contracts\CategoryRepositoryInterface;
use App\Modules\Service\Models\Category;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class CategoryService
{
    public function __construct(
        private readonly CategoryRepositoryInterface $categoryRepository,
    ) {}

    public function getTenantId(): string
    {
        return auth()->user()->tenant_id;
    }

    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->categoryRepository->paginate($this->getTenantId(), $filters, $perPage);
    }

    public function findAll(): Collection
    {
        return $this->categoryRepository->findAllByTenant($this->getTenantId());
    }

    public function findById(string $id): Category
    {
        return $this->categoryRepository->findOrFail($id);
    }

    public function create(array $data): Category
    {
        return DB::transaction(function () use ($data) {
            return $this->categoryRepository->create(array_merge($data, [
                'tenant_id' => $this->getTenantId(),
            ]));
        });
    }

    public function update(string $id, array $data): Category
    {
        return DB::transaction(function () use ($id, $data) {
            $category = $this->categoryRepository->findOrFail($id);

            return $this->categoryRepository->update($category, $data);
        });
    }

    public function delete(string $id): void
    {
        DB::transaction(function () use ($id) {
            $category = $this->categoryRepository->findOrFail($id);
            $this->categoryRepository->delete($category);
        });
    }

    public function getStats(): array
    {
        $tenantId = $this->getTenantId();

        return [
            'total_categories' => $this->categoryRepository->countByTenant($tenantId),
            'active' => $this->categoryRepository->countActiveByTenant($tenantId),
        ];
    }
}
