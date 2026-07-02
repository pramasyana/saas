<?php

declare(strict_types=1);

namespace App\Modules\Crm\Repositories;

use App\Modules\Crm\Contracts\TagRepositoryInterface;
use App\Modules\Crm\Models\Tag;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class TagRepository implements TagRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Tag::where('tenant_id', $tenantId);

        if (! empty($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        return $query->orderBy('name')->paginate($perPage);
    }

    public function findAllByTenant(string $tenantId): Collection
    {
        return Tag::where('tenant_id', $tenantId)
            ->where('is_active', true)
            ->orderBy('name')
            ->get();
    }

    public function findById(string $id): ?Tag
    {
        return Tag::find($id);
    }

    public function findOrFail(string $id): Tag
    {
        return Tag::findOrFail($id);
    }

    public function create(array $data): Tag
    {
        return Tag::create($data);
    }

    public function update(Tag $tag, array $data): Tag
    {
        $tag->update($data);

        return $tag;
    }

    public function delete(Tag $tag): bool
    {
        return $tag->delete();
    }

    public function countByTenant(string $tenantId): int
    {
        return Tag::where('tenant_id', $tenantId)->count();
    }

    public function countActiveByTenant(string $tenantId): int
    {
        return Tag::where('tenant_id', $tenantId)->where('is_active', true)->count();
    }

    public function searchByName(string $tenantId, string $name): Collection
    {
        return Tag::where('tenant_id', $tenantId)
            ->where('name', 'like', "%{$name}%")
            ->where('is_active', true)
            ->orderBy('name')
            ->get();
    }
}
