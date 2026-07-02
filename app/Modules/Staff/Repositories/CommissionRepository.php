<?php

declare(strict_types=1);

namespace App\Modules\Staff\Repositories;

use App\Modules\Staff\Contracts\CommissionRepositoryInterface;
use App\Modules\Staff\Models\Commission;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CommissionRepository implements CommissionRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Commission::where('tenant_id', $tenantId)->with('staff');

        if (!empty($filters['staff_id'])) {
            $query->where('staff_id', $filters['staff_id']);
        }

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (!empty($filters['date_from'])) {
            $query->where('date', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->where('date', '<=', $filters['date_to']);
        }

        return $query->orderByDesc('date')->orderByDesc('created_at')->paginate($perPage);
    }

    public function findById(string $id): ?Commission
    {
        return Commission::with('staff')->find($id);
    }

    public function create(array $data): Commission
    {
        return Commission::create($data);
    }

    public function update(Commission $commission, array $data): Commission
    {
        $commission->update($data);
        return $commission;
    }

    public function delete(Commission $commission): bool
    {
        return $commission->delete();
    }

    public function totalByStaff(string $tenantId, string $staffId, ?string $startDate = null, ?string $endDate = null): float
    {
        $query = Commission::where('tenant_id', $tenantId)->where('staff_id', $staffId);

        if ($startDate) {
            $query->where('date', '>=', $startDate);
        }

        if ($endDate) {
            $query->where('date', '<=', $endDate);
        }

        return (float) $query->sum('amount');
    }

    public function totalByTenant(string $tenantId, ?string $startDate = null, ?string $endDate = null): float
    {
        $query = Commission::where('tenant_id', $tenantId);

        if ($startDate) {
            $query->where('date', '>=', $startDate);
        }

        if ($endDate) {
            $query->where('date', '<=', $endDate);
        }

        return (float) $query->sum('amount');
    }

    public function countByTenant(string $tenantId, ?string $startDate = null, ?string $endDate = null): int
    {
        $query = Commission::where('tenant_id', $tenantId);

        if ($startDate) {
            $query->where('date', '>=', $startDate);
        }

        if ($endDate) {
            $query->where('date', '<=', $endDate);
        }

        return $query->count();
    }

    public function totalByType(string $tenantId, ?string $startDate = null, ?string $endDate = null): array
    {
        $query = Commission::where('tenant_id', $tenantId)
            ->selectRaw('type, SUM(amount) as total_amount, COUNT(*) as total_count')
            ->groupBy('type');

        if ($startDate) {
            $query->where('date', '>=', $startDate);
        }

        if ($endDate) {
            $query->where('date', '<=', $endDate);
        }

        return $query->get()->keyBy('type')->toArray();
    }

    public function getTopStaff(string $tenantId, ?string $startDate = null, ?string $endDate = null, int $limit = 1): array
    {
        $query = Commission::where('tenant_id', $tenantId)
            ->selectRaw('staff_id, SUM(amount) as total_amount')
            ->groupBy('staff_id')
            ->orderByDesc('total_amount')
            ->limit($limit);

        if ($startDate) {
            $query->where('date', '>=', $startDate);
        }

        if ($endDate) {
            $query->where('date', '<=', $endDate);
        }

        return $query->get()->toArray();
    }
}
