<?php

declare(strict_types=1);

namespace App\Modules\Booking\Contracts;

use App\Modules\Booking\Models\Room;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface RoomRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], ?string $branchId = null, int $perPage = 15): LengthAwarePaginator;

    public function findById(string $id): ?Room;

    public function findOrFail(string $id): Room;

    public function create(array $data): Room;

    public function update(Room $room, array $data): Room;

    public function delete(Room $room): bool;

    public function findAllByTenant(string $tenantId, ?string $branchId = null): Collection;

    public function getOverlappingBookings(string $tenantId, string $roomId, string $startTime, string $endTime, ?string $excludeId = null): Collection;
}
