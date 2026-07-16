<?php

declare(strict_types=1);

namespace App\Modules\Booking\Repositories;

use App\Modules\Booking\Contracts\CustomerInvoiceRepositoryInterface;
use App\Modules\Booking\Models\CustomerInvoice;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class CustomerInvoiceRepository implements CustomerInvoiceRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = CustomerInvoice::with(['customer', 'booking'])
            ->where('tenant_id', tenant()->getTenantKey());

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['customer_id'])) {
            $query->where('customer_id', $filters['customer_id']);
        }

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function (Builder $q) use ($search) {
                $q->where('number', 'like', "%{$search}%")
                    ->orWhereHas('customer', fn (Builder $cq) => $cq->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%"));
            });
        }

        $sort = $filters['sort'] ?? 'created_at';
        $direction = $filters['direction'] ?? 'desc';

        return $query->orderBy($sort, $direction)->paginate($perPage);
    }

    public function findById(string $id): ?CustomerInvoice
    {
        return CustomerInvoice::with(['customer', 'booking', 'items', 'booking.services'])
            ->where('tenant_id', tenant()->getTenantKey())
            ->find($id);
    }

    public function create(array $data): CustomerInvoice
    {
        return CustomerInvoice::create($data);
    }

    public function update(CustomerInvoice $invoice, array $data): CustomerInvoice
    {
        $invoice->update($data);

        return $invoice->fresh();
    }

    public function getStats(string $tenantId): array
    {
        $query = CustomerInvoice::where('tenant_id', $tenantId);

        $total = (clone $query)->count();
        $totalAmount = (clone $query)->sum('total_amount');
        $paidCount = (clone $query)->where('status', 'paid')->count();
        $paidAmount = (clone $query)->where('status', 'paid')->sum('paid_amount');
        $pendingCount = (clone $query)->whereIn('status', ['pending', 'partial'])->count();
        $pendingAmount = (clone $query)->whereIn('status', ['pending', 'partial'])->sum(DB::raw('total_amount - paid_amount'));
        $overdueCount = (clone $query)->whereIn('status', ['pending', 'partial'])
            ->where('due_date', '<', now())
            ->count();

        return [
            'total' => $total,
            'total_amount' => $totalAmount,
            'paid_count' => $paidCount,
            'paid_amount' => $paidAmount,
            'pending_count' => $pendingCount,
            'pending_amount' => $pendingAmount,
            'overdue_count' => $overdueCount,
        ];
    }
}
