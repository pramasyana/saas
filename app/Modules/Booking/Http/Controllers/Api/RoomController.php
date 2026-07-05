<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Booking\Contracts\RoomRepositoryInterface;
use App\Modules\Booking\Http\Requests\StoreRoomRequest;
use App\Modules\Booking\Http\Requests\UpdateRoomRequest;
use App\Modules\Booking\Http\Resources\RoomResource;
use App\Modules\Booking\Models\Room;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function __construct(
        private readonly RoomRepositoryInterface $roomRepository,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'is_active', 'branch_id']);
        $perPage = (int) $request->input('per_page', 15);
        $tenantId = tenant()->getTenantKey();
        $branchId = $request->input('branch_id');

        $rooms = $this->roomRepository->paginate($tenantId, $filters, $branchId, $perPage);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => RoomResource::collection($rooms),
            'meta' => [
                'current_page' => $rooms->currentPage(),
                'last_page' => $rooms->lastPage(),
                'per_page' => $rooms->perPage(),
                'total' => $rooms->total(),
            ],
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $room = $this->roomRepository->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => new RoomResource($room),
        ]);
    }

    public function store(StoreRoomRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['tenant_id'] = tenant()->getTenantKey();

        $room = $this->roomRepository->create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Room created successfully',
            'data' => new RoomResource($room),
        ], 201);
    }

    public function update(UpdateRoomRequest $request, string $id): JsonResponse
    {
        $room = $this->roomRepository->findOrFail($id);
        $this->roomRepository->update($room, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Room updated successfully',
            'data' => new RoomResource($room->fresh()),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $room = $this->roomRepository->findOrFail($id);
        $this->roomRepository->delete($room);

        return response()->json([
            'status' => 'success',
            'message' => 'Room deleted successfully',
        ]);
    }

    public function all(Request $request): JsonResponse
    {
        $tenantId = tenant()->getTenantKey();
        $branchId = $request->input('branch_id');
        $rooms = $this->roomRepository->findAllByTenant($tenantId, $branchId);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => RoomResource::collection($rooms),
        ]);
    }
}
