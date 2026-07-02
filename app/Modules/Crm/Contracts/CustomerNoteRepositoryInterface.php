<?php

declare(strict_types=1);

namespace App\Modules\Crm\Contracts;

use App\Modules\Crm\Models\CustomerNote;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface CustomerNoteRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findAllByTenant(string $tenantId): Collection;

    public function findById(string $id): ?CustomerNote;

    public function findOrFail(string $id): CustomerNote;

    public function create(array $data): CustomerNote;

    public function update(CustomerNote $customerNote, array $data): CustomerNote;

    public function delete(CustomerNote $customerNote): bool;

    public function findByCustomer(string $customerId): Collection;
}
