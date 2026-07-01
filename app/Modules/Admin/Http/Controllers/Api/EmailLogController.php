<?php

namespace App\Modules\Admin\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Notification\Services\EmailLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailLogController extends Controller
{
    public function __construct(
        private readonly EmailLogService $emailLogService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $logs = $this->emailLogService->paginate(
            $request->only(['search', 'status', 'channel', 'user_id']),
            min((int) $request->input('per_page', 15), 50),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => $logs->items(),
            'meta' => [
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
                'per_page' => $logs->perPage(),
                'total' => $logs->total(),
            ],
        ]);
    }

    public function deleteOld(): JsonResponse
    {
        $result = $this->emailLogService->deleteOld();

        if ($result['deleted'] === 0) {
            return response()->json([
                'status' => 'success',
                'message' => 'Tidak ada log yang perlu dihapus.',
                'data' => $result,
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => "{$result['deleted']} log berhasil dihapus.",
            'data' => $result,
        ]);
    }
}
