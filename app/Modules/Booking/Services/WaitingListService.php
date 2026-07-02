<?php

declare(strict_types=1);

namespace App\Modules\Booking\Services;

use App\Modules\Booking\Contracts\WaitingListRepositoryInterface;
use App\Modules\Booking\Models\WaitingList;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class WaitingListService
{
    public function __construct(
        private readonly WaitingListRepositoryInterface $waitingListRepository,
    ) {}

    public function getTenantId(): string
    {
        return auth()->user()->tenant_id;
    }

    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->waitingListRepository->paginate($this->getTenantId(), $filters, $perPage);
    }

    public function findById(string $id): WaitingList
    {
        return $this->waitingListRepository->findOrFail($id);
    }

    public function create(array $data): WaitingList
    {
        return DB::transaction(function () use ($data) {
            $data['tenant_id'] = $this->getTenantId();
            $data['position'] = $this->waitingListRepository->getNextPosition(
                $this->getTenantId(),
                $data['preferred_date'],
            );

            return $this->waitingListRepository->create($data);
        });
    }

    public function update(string $id, array $data): WaitingList
    {
        return DB::transaction(function () use ($id, $data) {
            $waitingList = $this->waitingListRepository->findOrFail($id);

            return $this->waitingListRepository->update($waitingList, $data);
        });
    }

    public function delete(string $id): void
    {
        DB::transaction(function () use ($id) {
            $waitingList = $this->waitingListRepository->findOrFail($id);
            $this->waitingListRepository->delete($waitingList);
        });
    }

    public function notify(string $id): WaitingList
    {
        return DB::transaction(function () use ($id) {
            $waitingList = $this->waitingListRepository->findOrFail($id);

            return $this->waitingListRepository->update($waitingList, [
                'status' => 'notified',
                'notified_at' => now(),
            ]);
        });
    }

    public function getStats(): array
    {
        $tenantId = $this->getTenantId();

        return [
            'total' => $this->waitingListRepository->countByTenant($tenantId),
            'waiting' => $this->waitingListRepository->countByTenant($tenantId), // Simplified
        ];
    }
}
