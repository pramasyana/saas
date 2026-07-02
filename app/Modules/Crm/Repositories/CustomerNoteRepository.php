<?php

declare(strict_types=1);

namespace App\Modules\Crm\Repositories;

use App\Modules\Crm\Contracts\CustomerNoteRepositoryInterface;
use App\Modules\Crm\Models\CustomerNote;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class CustomerNoteRepository implements CustomerNoteRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = CustomerNote::where('tenant_id', $tenantId);

        if (! empty($filters['customer_id'])) {
            $query->where('customer_id', $filters['customer_id']);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function findAllByTenant(string $tenantId): Collection
    {
        return CustomerNote::where('tenant_id', $tenantId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function findById(string $id): ?CustomerNote
    {
        return CustomerNote::find($id);
    }

    public function findOrFail(string $id): CustomerNote
    {
        return CustomerNote::findOrFail($id);
    }

    public function create(array $data): CustomerNote
    {
        return CustomerNote::create($data);
    }

    public function update(CustomerNote $customerNote, array $data): CustomerNote
    {
        $customerNote->update($data);

        return $customerNote;
    }

    public function delete(CustomerNote $customerNote): bool
    {
        return $customerNote->delete();
    }

    public function findByCustomer(string $customerId): Collection
    {
        return CustomerNote::where('customer_id', $customerId)
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
