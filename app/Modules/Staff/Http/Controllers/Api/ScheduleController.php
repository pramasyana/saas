<?php

declare(strict_types=1);

namespace App\Modules\Staff\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Staff\Http\Requests\StoreScheduleRequest;
use App\Modules\Staff\Http\Resources\ScheduleResource;
use App\Modules\Staff\Services\StaffService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function __construct(
        private readonly StaffService $staffService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $staffId = $request->input('staff_id');
        if (!$staffId) {
            return response()->json([
                'status' => 'error',
                'message' => 'Parameter staff_id wajib diisi.',
            ], 422);
        }

        $schedules = $this->staffService->getSchedules($staffId);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => ScheduleResource::collection($schedules),
        ]);
    }

    public function update(StoreScheduleRequest $request): JsonResponse
    {
        $this->staffService->updateSchedules(
            $request->input('staff_id'),
            $request->input('schedules'),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Jadwal berhasil diperbarui.',
        ]);
    }
}
