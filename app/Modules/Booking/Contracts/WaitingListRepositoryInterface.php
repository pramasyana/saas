<?php

declare(strict_types=1);

namespace App\Modules\Booking\Contracts;

use App\Modules\Booking\Models\WaitingList;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface WaitingListRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findById(string $id): ?WaitingList;

    public function findOrFail(string $id): WaitingList;

    public function create(array $data): WaitingList;

    public function update(WaitingList $waitingList, array $data): WaitingList;

    public function delete(WaitingList $waitingList): bool;

    public function countByTenant(string $tenantId): int;

    public function getNextPosition(string $tenantId, string $date): int;

    public function getWaitingByDate(string $tenantId, string $date): Collection;
}
