<?php

namespace App\Modules\Admin\Services;

use App\Models\Tenant;
use Illuminate\Pagination\LengthAwarePaginator;

class TenantActivityService
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Tenant::with([
            'user',
            'domains',
            'subscriptions.plan',
            'companyProfile',
        ])->withCount([
            'users',
            'branches',
        ])->orderBy('created_at', 'desc');

        if (! empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('id', 'like', '%'.$filters['search'].'%')
                    ->orWhereHas('user', fn ($uq) => $uq->where('name', 'like', '%'.$filters['search'].'%')
                        ->orWhere('email', 'like', '%'.$filters['search'].'%'));
            });
        }

        if (! empty($filters['status'])) {
            if ($filters['status'] === 'active') {
                $query->whereHas('subscriptions', fn ($sq) => $sq->where('status', 'active'));
            } elseif ($filters['status'] === 'trial') {
                $query->whereHas('subscriptions', fn ($sq) => $sq->where('status', 'trialing'));
            } elseif ($filters['status'] === 'inactive') {
                $query->whereDoesntHave('subscriptions', fn ($sq) => $sq->whereIn('status', ['active', 'trialing']));
            }
        }

        return $query->paginate($perPage);
    }
}
