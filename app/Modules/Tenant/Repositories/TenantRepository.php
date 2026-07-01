<?php

declare(strict_types=1);

namespace App\Modules\Tenant\Repositories;

use App\Models\Tenant;
use App\Modules\Tenant\Contracts\TenantRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class TenantRepository implements TenantRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Tenant::with(['domains', 'user'])->withCount(['users', 'subscriptions']);

        if (! empty($filters['search'])) {
            $query->where(function ($q) use ($filters): void {
                $q->where('id', 'like', "%{$filters['search']}%");
            });
        }

        if (! empty($filters['sort'])) {
            $query->orderBy($filters['sort'], $filters['direction'] ?? 'asc');
        } else {
            $query->latest();
        }

        return $query->paginate($perPage);
    }

    public function findById(string $id): ?Tenant
    {
        return Tenant::find($id);
    }

    public function create(array $data): Tenant
    {
        return Tenant::create($data);
    }

    public function update(Tenant $tenant, array $data): Tenant
    {
        $tenant->update($data);

        return $tenant;
    }

    public function delete(Tenant $tenant): bool
    {
        return $tenant->delete();
    }

    public function getStats(): array
    {
        return [
            'total' => Tenant::count(),
            'with_domains' => Tenant::has('domains')->count(),
        ];
    }

    public function findByIdWithRelations(string $id): ?Tenant
    {
        return Tenant::with(['domains', 'user'])->find($id);
    }
}
