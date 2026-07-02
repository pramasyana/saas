<?php

declare(strict_types=1);

namespace App\Modules\Staff\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Staff\Http\Requests\StoreAttendanceRequest;
use App\Modules\Staff\Http\Resources\AttendanceResource;
use App\Modules\Staff\Services\StaffService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function __construct(
        private readonly StaffService $staffService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $attendance = $this->staffService->paginateAttendance(
            $request->only(['staff_id', 'date', 'date_from', 'date_to', 'status']),
            (int) $request->input('per_page', 15),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => AttendanceResource::collection($attendance),
            'meta' => [
                'current_page' => $attendance->currentPage(),
                'last_page' => $attendance->lastPage(),
                'per_page' => $attendance->perPage(),
                'total' => $attendance->total(),
            ],
        ]);
    }

    public function store(StoreAttendanceRequest $request): JsonResponse
    {
        $attendance = $this->staffService->createAttendance($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Absensi berhasil dicatat.',
            'data' => new AttendanceResource($attendance),
        ], 201);
    }

    public function update(StoreAttendanceRequest $request, string $id): JsonResponse
    {
        $attendance = $this->staffService->updateAttendance($id, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Absensi berhasil diupdate.',
            'data' => new AttendanceResource($attendance),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $this->staffService->deleteAttendance($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Absensi berhasil dihapus.',
        ]);
    }
}
