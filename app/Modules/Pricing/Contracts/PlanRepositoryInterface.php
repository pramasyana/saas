<?php

namespace App\Modules\Pricing\Contracts;

use App\Modules\Pricing\Models\Plan;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface PlanRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findById(string $id): ?Plan;

    public function findActiveById(string $id): ?Plan;

    public function create(array $data): Plan;

    public function update(Plan $plan, array $data): Plan;

    public function delete(Plan $plan): bool;

    public function getAllActive(): Collection;

    public function unsetPopularExcept(string $planId): void;

    public function unsetAllPopular(): void;

    public function syncFeatures(Plan $plan, array $features): void;

    /** @return array{total_plans: int, active_plans: int, cheapest_price: float|null} */
    public function getStats(): array;
}
