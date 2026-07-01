<?php

declare(strict_types=1);

namespace App\Modules\Company\Contracts;

use App\Modules\Company\Models\Branch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface BranchRepositoryInterface
{
    public function findAllByTenant(string $tenantId, array $filters = []): LengthAwarePaginator;

    public function findById(string $id): ?Branch;

    public function findBySlug(string $tenantId, string $slug): ?Branch;

    public function create(array $data): Branch;

    public function update(Branch $branch, array $data): Branch;

    public function delete(Branch $branch): void;
}
