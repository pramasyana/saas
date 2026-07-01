<?php

namespace App\Modules\Subscription\Repositories;

use App\Modules\Subscription\Contracts\InvoiceRepositoryInterface;
use App\Modules\Subscription\Models\Invoice;
use Illuminate\Pagination\LengthAwarePaginator;

class InvoiceRepository implements InvoiceRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Invoice::with('subscription.user', 'subscription.plan');

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['subscription_id'])) {
            $query->where('subscription_id', $filters['subscription_id']);
        }

        $sort = $filters['sort'] ?? 'created_at';
        $direction = $filters['direction'] ?? 'desc';
        $query->orderBy($sort, $direction);

        return $query->paginate($perPage);
    }

    public function findById(string $id): ?Invoice
    {
        return Invoice::with('subscription.user', 'subscription.plan')->find($id);
    }

    public function create(array $data): Invoice
    {
        return Invoice::create($data);
    }

    public function update(Invoice $invoice, array $data): Invoice
    {
        $invoice->update($data);

        return $invoice->fresh('subscription');
    }
}
