<?php

declare(strict_types=1);

namespace App\Modules\Staff\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Staff\Services\ShiftAssignmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShiftAssignmentController extends Controller
{
    public function __construct(
        private readonly ShiftAssignmentService $service,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'branch_id' => 'nullable|string|exists:branches,id',
        ]);

        $data = $this->service->getCalendarData(
            $validated['start_date'],
            $validated['end_date'],
            $validated['branch_id'] ?? null,
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => $data,
        ]);
    }

    public function bulkStore(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'assignments' => 'required|array|min:1',
            'assignments.*.staff_id' => 'required|string|exists:staff,id',
            'assignments.*.date' => 'required|date',
            'assignments.*.start_time' => 'required|date_format:H:i',
            'assignments.*.end_time' => 'required|date_format:H:i|after:assignments.*.start_time',
            'assignments.*.notes' => 'nullable|string|max:255',
        ]);

        $result = $this->service->bulkAssign($validated['assignments']);

        return response()->json([
            'status' => 'success',
            'message' => 'Shift berhasil disimpan.',
            'data' => $result,
        ]);
    }

    public function destroy(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.staff_id' => 'required|string|exists:staff,id',
            'items.*.date' => 'required|date',
        ]);

        $deleted = $this->service->bulkRemove($validated['items']);

        return response()->json([
            'status' => 'success',
            'message' => "{$deleted} shift berhasil dihapus.",
            'data' => ['deleted' => $deleted],
        ]);
    }
}
