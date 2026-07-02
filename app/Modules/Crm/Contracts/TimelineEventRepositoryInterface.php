<?php

declare(strict_types=1);

namespace App\Modules\Crm\Contracts;

use App\Modules\Crm\Models\TimelineEvent;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface TimelineEventRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findAllByTenant(string $tenantId): Collection;

    public function findById(string $id): ?TimelineEvent;

    public function findOrFail(string $id): TimelineEvent;

    public function create(array $data): TimelineEvent;

    public function update(TimelineEvent $timelineEvent, array $data): TimelineEvent;

    public function delete(TimelineEvent $timelineEvent): bool;

    public function findByCustomer(string $customerId): Collection;
}
