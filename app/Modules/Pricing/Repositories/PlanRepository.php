<?php

namespace App\Modules\Pricing\Repositories;

use App\Modules\Pricing\Contracts\PlanRepositoryInterface;
use App\Modules\Pricing\Models\Plan;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class PlanRepository implements PlanRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Plan::query()->with('features.definition');

        if (! empty($filters['search'])) {
            $query->where(function ($q) use ($filters): void {
                $q->where('name', 'like', "%{$filters['search']}%")
                    ->orWhere('slug', 'like', "%{$filters['search']}%")
                    ->orWhere('description', 'like', "%{$filters['search']}%");
            });
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        $sortField = $filters['sort'] ?? 'sort_order';
        $direction = $filters['direction'] ?? 'asc';
        $query->orderBy($sortField, $direction);

        return $query->paginate($perPage);
    }

    public function findById(string $id): ?Plan
    {
        return Plan::with('features.definition')->find($id);
    }

    public function create(array $data): Plan
    {
        return Plan::create($data);
    }

    public function update(Plan $plan, array $data): Plan
    {
        $plan->update($data);

        return $plan;
    }

    public function delete(Plan $plan): bool
    {
        return $plan->delete();
    }

    public function getAllActive(): Collection
    {
        return Plan::with('features.definition')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();
    }
}
