<?php

declare(strict_types=1);

namespace App\Modules\Booking\Repositories;

use App\Modules\Booking\Contracts\RoomRepositoryInterface;
use App\Modules\Booking\Models\Room;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class RoomRepository implements RoomRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], ?string $branchId = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = Room::where('tenant_id', $tenantId);

        if ($branchId !== null) {
            $query->where('branch_id', $branchId);
        }

        if (! empty($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        if (! empty($filters['branch_id'])) {
            $query->where('branch_id', $filters['branch_id']);
        }

        return $query->with('branch')
            ->orderBy('name')
            ->paginate($perPage);
    }

    public function findById(string $id): ?Room
    {
        return Room::with('branch')->find($id);
    }

    public function findOrFail(string $id): Room
    {
        return Room::with('branch')->findOrFail($id);
    }

    public function create(array $data): Room
    {
        return Room::create($data);
    }

    public function update(Room $room, array $data): Room
    {
        $room->update($data);

        return $room;
    }

    public function delete(Room $room): bool
    {
        return $room->delete();
    }

    public function findAllByTenant(string $tenantId, ?string $branchId = null): Collection
    {
        $query = Room::where('tenant_id', $tenantId)->where('is_active', true);

        if ($branchId !== null) {
            $query->where('branch_id', $branchId);
        }

        return $query->orderBy('name')->get();
    }

    public function getOverlappingBookings(string $tenantId, string $roomId, string $startTime, string $endTime, ?string $excludeId = null): Collection
    {
        $query = \App\Modules\Booking\Models\BookingRoom::whereHas('booking', function ($q) use ($tenantId) {
            $q->where('tenant_id', $tenantId)->whereNotIn('status', ['cancelled', 'no_show']);
        })
            ->where('room_id', $roomId)
            ->where('start_time', '<', $endTime)
            ->where('end_time', '>', $startTime);

        if ($excludeId !== null) {
            $query->where('booking_id', '!=', $excludeId);
        }

        return $query->get();
    }
}
