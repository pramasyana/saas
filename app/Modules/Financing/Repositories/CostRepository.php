<?php

declare(strict_types=1);

namespace App\Modules\Financing\Repositories;

use App\Modules\Financing\Contracts\CostRepositoryInterface;
use App\Modules\Financing\Models\Cost;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class CostRepository implements CostRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Cost::where('tenant_id', $tenantId)->with(['category', 'creator']);

        if (! empty($filters['search'])) {
            $query->where(function ($q) use ($filters): void {
                $q->where('name', 'like', "%{$filters['search']}%")
                    ->orWhere('notes', 'like', "%{$filters['search']}%");
            });
        }

        if (! empty($filters['category_id'])) {
            $query->where('cost_category_id', $filters['category_id']);
        }

        if (! empty($filters['date_from'])) {
            $query->where('date', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->where('date', '<=', $filters['date_to']);
        }

        return $query->orderBy('date', 'desc')->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function findById(string $id): ?Cost
    {
        return Cost::with(['category', 'creator'])->find($id);
    }

    public function findOrFail(string $id): Cost
    {
        return Cost::with(['category', 'creator'])->findOrFail($id);
    }

    public function create(array $data): Cost
    {
        return Cost::create($data);
    }

    public function update(Cost $cost, array $data): Cost
    {
        $cost->update($data);

        return $cost;
    }

    public function delete(Cost $cost): bool
    {
        return $cost->delete();
    }

    public function countByTenant(string $tenantId): int
    {
        return Cost::where('tenant_id', $tenantId)->count();
    }

    public function sumByTenant(string $tenantId, string $startDate, string $endDate): float
    {
        return (float) Cost::where('tenant_id', $tenantId)
            ->where('date', '>=', $startDate)
            ->where('date', '<=', $endDate)
            ->sum('amount');
    }

    public function sumByCategory(string $tenantId, string $startDate, string $endDate): array
    {
        return Cost::where('tenant_id', $tenantId)
            ->where('date', '>=', $startDate)
            ->where('date', '<=', $endDate)
            ->join('cost_categories', 'costs.cost_category_id', '=', 'cost_categories.id')
            ->select('cost_categories.name', 'cost_categories.color', DB::raw('SUM(costs.amount) as total'))
            ->groupBy('cost_categories.name', 'cost_categories.color')
            ->orderByDesc('total')
            ->get()
            ->toArray();
    }

    public function getMonthlyCosts(string $tenantId, int $months = 12): array
    {
        $start = CarbonImmutable::now()->subMonths($months - 1)->startOfMonth();

        $costs = Cost::where('tenant_id', $tenantId)
            ->where('date', '>=', $start)
            ->select(DB::raw("DATE_FORMAT(date, '%Y-%m') as month_key"), DB::raw('SUM(amount) as total'))
            ->groupBy('month_key')
            ->pluck('total', 'month_key');

        $labels = [];
        $data = [];

        for ($i = 0; $i < $months; $i++) {
            $date = $start->addMonthsNoOverflow($i);
            $key = $date->format('Y-m');

            $labels[] = $date->isoFormat('MMM Y');
            $data[] = (float) ($costs[$key] ?? 0);
        }

        return [
            'labels' => $labels,
            'costs' => $data,
        ];
    }

    public function bulkInsert(string $tenantId, array $records): int
    {
        $insertData = array_map(fn ($record) => [
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'tenant_id' => $tenantId,
            'cost_category_id' => $record['cost_category_id'],
            'name' => $record['name'],
            'amount' => $record['amount'],
            'date' => $record['date'],
            'notes' => $record['notes'] ?? null,
            'created_by' => $record['created_by'],
            'created_at' => now(),
            'updated_at' => now(),
        ], $records);

        return Cost::insert($insertData) ? count($insertData) : 0;
    }
}
