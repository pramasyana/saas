<?php

namespace App\Modules\Admin\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminActivityLog;
use App\Modules\Admin\Services\ActivityLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function __construct(
        private readonly ActivityLogService $activityLogService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $logs = $this->activityLogService->paginate(
            $request->only(['user_id', 'action', 'from', 'to']),
            (int) $request->input('per_page', 25),
        );

        $data = $logs->map(fn (AdminActivityLog $log) => [
            'id' => $log->id,
            'user' => $log->user ? ['id' => $log->user->id, 'name' => $log->user->name, 'email' => $log->user->email] : null,
            'action' => $log->action,
            'subject_type' => $log->subject_type,
            'subject_id' => $log->subject_id,
            'description' => $log->description,
            'metadata' => $log->metadata,
            'ip_address' => $log->ip_address,
            'created_at' => $log->created_at?->toISOString(),
        ]);

        $actions = AdminActivityLog::select('action')
            ->distinct()
            ->orderBy('action')
            ->pluck('action');

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => $data,
            'meta' => [
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
                'per_page' => $logs->perPage(),
                'total' => $logs->total(),
            ],
            'actions' => $actions,
        ]);
    }
}
