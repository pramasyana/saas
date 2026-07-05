<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Controllers\Api\Public;

use App\Modules\Booking\Models\Room;
use App\Modules\Booking\Services\AvailabilityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicRoomController
{
    public function __construct(
        private readonly AvailabilityService $availabilityService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $config = tenant()->getInternal('booking_config') ?? [];

        if (! ($config['enabled'] ?? false)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Booking online sedang tidak aktif.',
            ], 403);
        }

        $rooms = Room::where('is_active', true);

        if ($request->filled('branch_id')) {
            $rooms->where('branch_id', $request->branch_id);
        }

        return response()->json([
            'status' => 'success',
            'data' => $rooms->orderBy('name')->get(['id', 'name', 'capacity', 'color', 'branch_id']),
        ]);
    }

    public function available(Request $request): JsonResponse
    {
        $config = tenant()->getInternal('booking_config') ?? [];

        if (! ($config['enabled'] ?? false)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Booking online sedang tidak aktif.',
            ], 403);
        }

        $request->validate([
            'date' => 'required|date_format:Y-m-d',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'branch_id' => 'nullable|string|exists:branches,id',
        ]);

        $rooms = $this->availabilityService->getAvailableRooms(
            date: $request->date,
            startTime: $request->start_time,
            endTime: $request->end_time,
            branchId: $request->branch_id,
        );

        return response()->json([
            'status' => 'success',
            'data' => $rooms,
        ]);
    }
}
