<?php

declare(strict_types=1);

namespace App\Modules\Crm\Repositories;

use App\Modules\Crm\Contracts\TimelineEventRepositoryInterface;
use App\Modules\Crm\Models\TimelineEvent;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class TimelineEventRepository implements TimelineEventRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = TimelineEvent::where('tenant_id', $tenantId);

        if (! empty($filters['customer_id'])) {
            $query->where('customer_id', $filters['customer_id']);
        }

        if (! empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function findAllByTenant(string $tenantId): Collection
    {
        return TimelineEvent::where('tenant_id', $tenantId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function findById(string $id): ?TimelineEvent
    {
        return TimelineEvent::find($id);
    }

    public function findOrFail(string $id): TimelineEvent
    {
        return TimelineEvent::findOrFail($id);
    }

    public function create(array $data): TimelineEvent
    {
        return TimelineEvent::create($data);
    }

    public function update(TimelineEvent $timelineEvent, array $data): TimelineEvent
    {
        $timelineEvent->update($data);

        return $timelineEvent;
    }

    public function delete(TimelineEvent $timelineEvent): bool
    {
        return $timelineEvent->delete();
    }

    public function findByCustomer(string $customerId): Collection
    {
        return TimelineEvent::where('customer_id', $customerId)
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
