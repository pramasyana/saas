<?php

namespace App\Modules\Admin\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Notification\Models\EmailLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class EmailLogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = EmailLog::with('user:id,name,email')
            ->latest();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('subject', 'like', "%{$search}%")
                    ->orWhere('error_message', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($channel = $request->input('channel')) {
            $query->where('channel', $channel);
        }

        if ($userId = $request->input('user_id')) {
            $query->where('user_id', $userId);
        }

        $perPage = min((int) $request->input('per_page', 15), 50);

        $logs = $query->paginate($perPage);

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
        $cutoff = now()->subMonths(3);
        $count = EmailLog::where('created_at', '<', $cutoff)->count();

        if ($count === 0) {
            return response()->json([
                'status' => 'success',
                'message' => 'Tidak ada log yang perlu dihapus.',
                'data' => ['deleted' => 0],
            ]);
        }

        EmailLog::where('created_at', '<', $cutoff)->delete();

        Log::info('Old email logs deleted', [
            'count' => $count,
            'cutoff' => $cutoff->toDateTimeString(),
            'deleted_by' => auth()->id(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "{$count} log berhasil dihapus.",
            'data' => ['deleted' => $count],
        ]);
    }
}
