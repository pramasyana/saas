<?php

declare(strict_types=1);

namespace App\Modules\Booking\Repositories;

use App\Modules\Booking\Contracts\WaitingListRepositoryInterface;
use App\Modules\Booking\Models\WaitingList;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class WaitingListRepository implements WaitingListRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = WaitingList::where('tenant_id', $tenantId);

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['date'])) {
            $query->whereDate('preferred_date', $filters['date']);
        }

        if (! empty($filters['search'])) {
            $query->where(function ($q) use ($filters): void {
                $q->whereHas('customer', function ($cq) use ($filters): void {
                    $cq->where('name', 'like', "%{$filters['search']}%");
                });
            });
        }

        return $query->with(['customer', 'service'])
            ->orderBy('position')
            ->paginate($perPage);
    }

    public function findById(string $id): ?WaitingList
    {
        return WaitingList::with(['customer', 'service'])->find($id);
    }

    public function findOrFail(string $id): WaitingList
    {
        return WaitingList::with(['customer', 'service'])->findOrFail($id);
    }

    public function create(array $data): WaitingList
    {
        return WaitingList::create($data);
    }

    public function update(WaitingList $waitingList, array $data): WaitingList
    {
        $waitingList->update($data);

        return $waitingList;
    }

    public function delete(WaitingList $waitingList): bool
    {
        return $waitingList->delete();
    }

    public function countByTenant(string $tenantId): int
    {
        return WaitingList::where('tenant_id', $tenantId)->count();
    }

    public function getNextPosition(string $tenantId, string $date): int
    {
        $max = WaitingList::where('tenant_id', $tenantId)
            ->whereDate('preferred_date', $date)
            ->whereIn('status', ['waiting', 'notified'])
            ->max('position');

        return ($max ?? 0) + 1;
    }

    public function getWaitingByDate(string $tenantId, string $date): Collection
    {
        return WaitingList::where('tenant_id', $tenantId)
            ->whereDate('preferred_date', $date)
            ->where('status', 'waiting')
            ->with(['customer', 'service'])
            ->orderBy('position')
            ->get();
    }
}
