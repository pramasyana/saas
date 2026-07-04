<?php

declare(strict_types=1);

namespace App\Modules\Company\Repositories;

use App\Modules\Company\Contracts\HolidayRepositoryInterface;
use App\Modules\Company\Models\Holiday;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class HolidayRepository implements HolidayRepositoryInterface
{
    public function findAllByTenant(string $tenantId, array $filters = []): LengthAwarePaginator
    {
        $query = Holiday::where('tenant_id', $tenantId);

        if (! empty($filters['search'])) {
            $query->where(function ($q) use ($filters): void {
                $q->where('name', 'like', "%{$filters['search']}%");
            });
        }

        if (! empty($filters['branch_id'])) {
            $query->where('branch_id', $filters['branch_id']);
        }

        if (! empty($filters['year'])) {
            $query->whereYear('date_start', $filters['year']);
        }

        if (! empty($filters['upcoming'])) {
            $query->where('date_end', '>=', now()->startOfDay());
        }

        if (! empty($filters['date'])) {
            $query->where('date_start', '<=', $filters['date'])
                  ->where('date_end', '>=', $filters['date']);
        }

        $sort = $filters['sort'] ?? 'date_start';
        $direction = $filters['direction'] ?? 'asc';
        $query->orderBy($sort, $direction);

        $perPage = (int) ($filters['per_page'] ?? 15);

        return $query->paginate($perPage);
    }

    public function findById(string $id): ?Holiday
    {
        return Holiday::find($id);
    }

    public function create(array $data): Holiday
    {
        return Holiday::create($data);
    }

    public function update(Holiday $holiday, array $data): Holiday
    {
        $holiday->update($data);

        return $holiday;
    }

    public function delete(Holiday $holiday): void
    {
        $holiday->delete();
    }
}
