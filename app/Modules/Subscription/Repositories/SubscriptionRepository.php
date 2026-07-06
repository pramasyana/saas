<?php

namespace App\Modules\Subscription\Repositories;

use App\Modules\Subscription\Contracts\SubscriptionRepositoryInterface;
use App\Modules\Subscription\Models\Subscription;
use Illuminate\Pagination\LengthAwarePaginator;

class SubscriptionRepository implements SubscriptionRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Subscription::with(['user', 'plan']);

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', fn ($u) => $u->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"))
                    ->orWhereHas('plan', fn ($p) => $p->where('name', 'like', "%{$search}%"));
            });
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['tenant_id'])) {
            $query->where('tenant_id', $filters['tenant_id']);
        }

        $sort = $filters['sort'] ?? 'created_at';
        $direction = $filters['direction'] ?? 'desc';
        $query->orderBy($sort, $direction);

        return $query->paginate($perPage);
    }

    public function findById(string $id): ?Subscription
    {
        return Subscription::with(['user', 'plan', 'invoices'])->find($id);
    }

    public function create(array $data): Subscription
    {
        return Subscription::create($data);
    }

    public function update(Subscription $subscription, array $data): Subscription
    {
        $subscription->update($data);

        return $subscription->fresh(['user', 'plan']);
    }

    public function delete(Subscription $subscription): void
    {
        $subscription->delete();
    }

    public function getStats(): array
    {
        return [
            'active' => Subscription::where('status', 'active')->count(),
            'cancelled' => Subscription::where('status', 'cancelled')->count(),
            'total_revenue' => (float) Subscription::where('status', 'active')->sum('price_amount'),
        ];
    }

    public function getStatsByTenant(string $tenantId): array
    {
        return [
            'active' => Subscription::where('tenant_id', $tenantId)->where('status', 'active')->count(),
            'cancelled' => Subscription::where('tenant_id', $tenantId)->where('status', 'cancelled')->count(),
            'total_revenue' => (float) Subscription::where('tenant_id', $tenantId)->where('status', 'active')->sum('price_amount'),
        ];
    }

    public function findByTenantId(string $tenantId): ?Subscription
    {
        return Subscription::with(['user', 'plan', 'invoices'])
            ->where('tenant_id', $tenantId)
            ->where('status', 'active')
            ->first();
    }
}
