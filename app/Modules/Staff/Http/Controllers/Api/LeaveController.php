<?php

declare(strict_types=1);

namespace App\Modules\Staff\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Staff\Http\Requests\StoreLeaveRequest;
use App\Modules\Staff\Http\Requests\UpdateLeaveRequest;
use App\Modules\Staff\Http\Resources\LeaveResource;
use App\Modules\Staff\Services\StaffService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeaveController extends Controller
{
    public function __construct(
        private readonly StaffService $staffService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $leaves = $this->staffService->paginateLeaves(
            $request->only(['staff_id', 'status', 'type', 'date_from', 'date_to']),
            (int) $request->input('per_page', 15),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => LeaveResource::collection($leaves),
            'meta' => [
                'current_page' => $leaves->currentPage(),
                'last_page' => $leaves->lastPage(),
                'per_page' => $leaves->perPage(),
                'total' => $leaves->total(),
            ],
        ]);
    }

    public function store(StoreLeaveRequest $request): JsonResponse
    {
        $leave = $this->staffService->createLeave($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Pengajuan cuti berhasil dibuat.',
            'data' => new LeaveResource($leave),
        ], 201);
    }

    public function update(UpdateLeaveRequest $request, string $id): JsonResponse
    {
        $leave = $this->staffService->approveLeave($id, $request->input('status'));

        return response()->json([
            'status' => 'success',
            'message' => 'Status cuti berhasil diperbarui.',
            'data' => new LeaveResource($leave),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $this->staffService->deleteLeave($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Pengajuan cuti berhasil dihapus.',
        ]);
    }
}
