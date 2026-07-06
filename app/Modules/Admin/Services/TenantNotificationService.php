<?php

namespace App\Modules\Admin\Services;

use App\Models\AdminTenantNotification;
use Illuminate\Pagination\LengthAwarePaginator;

class TenantNotificationService
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = AdminTenantNotification::latest();

        if (! empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%'.$filters['search'].'%')
                  ->orWhere('message', 'like', '%'.$filters['search'].'%');
            });
        }

        if (! empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (! empty($filters['is_active'])) {
            $query->where('is_active', $filters['is_active'] === 'true' || $filters['is_active'] === '1');
        }

        return $query->paginate($perPage);
    }

    public function create(array $data): AdminTenantNotification
    {
        return AdminTenantNotification::create($data);
    }

    public function findById(string $id): AdminTenantNotification
    {
        return AdminTenantNotification::findOrFail($id);
    }

    public function update(string $id, array $data): AdminTenantNotification
    {
        $notification = $this->findById($id);
        $notification->update($data);

        return $notification;
    }

    public function delete(string $id): void
    {
        $this->findById($id)->delete();
    }

    public function toggleActive(string $id): AdminTenantNotification
    {
        $notification = $this->findById($id);
        $notification->update(['is_active' => ! $notification->is_active]);

        return $notification;
    }

    public function markAsRead(string $id, string $tenantId): AdminTenantNotification
    {
        $notification = $this->findById($id);
        $readBy = $notification->read_by ?? [];

        if (! in_array($tenantId, $readBy)) {
            $readBy[] = $tenantId;
            $notification->update(['read_by' => $readBy]);
        }

        return $notification;
    }

    public function getActiveForTenant(string $tenantId): array
    {
        return AdminTenantNotification::active()
            ->forTenant($tenantId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->toArray();
    }

    public function getUnreadCount(string $tenantId): int
    {
        return AdminTenantNotification::active()
            ->forTenant($tenantId)
            ->get()
            ->filter(function ($n) use ($tenantId) {
                $readBy = $n->read_by ?? [];

                return ! in_array($tenantId, $readBy);
            })
            ->count();
    }
}
