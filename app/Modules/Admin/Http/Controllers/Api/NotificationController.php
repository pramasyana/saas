<?php

namespace App\Modules\Admin\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) ($request->get('per_page', 15)), 50);
        $query = AdminNotification::orderBy('created_at', 'desc');

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }

        if ($type = $request->get('type')) {
            $query->where('type', $type);
        }

        if ($request->has('is_active')) {
            $isActive = filter_var($request->get('is_active'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if ($isActive !== null) {
                $query->where('is_active', $isActive);
            }
        }

        $notifications = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => $notifications->items(),
            'meta' => [
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'per_page' => $notifications->perPage(),
                'total' => $notifications->total(),
            ],
        ]);
    }

    public function active(): JsonResponse
    {
        $notifications = AdminNotification::where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('active_from')
                  ->orWhere('active_from', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('active_until')
                  ->orWhere('active_until', '>=', now());
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => $notifications,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'required|in:info,warning,success,danger',
            'is_active' => 'boolean',
            'active_from' => 'nullable|date',
            'active_until' => 'nullable|date|after_or_equal:active_from',
        ]);

        $notification = AdminNotification::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Notifikasi berhasil dibuat.',
            'data' => $notification,
        ], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $notification = AdminNotification::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'required|in:info,warning,success,danger',
            'is_active' => 'boolean',
            'active_from' => 'nullable|date',
            'active_until' => 'nullable|date|after_or_equal:active_from',
        ]);

        $notification->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Notifikasi berhasil diperbarui.',
            'data' => $notification,
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $notification = AdminNotification::findOrFail($id);
        $notification->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Notifikasi berhasil dihapus.',
        ]);
    }

    public function toggleActive(string $id): JsonResponse
    {
        $notification = AdminNotification::findOrFail($id);
        $notification->update(['is_active' => ! $notification->is_active]);

        return response()->json([
            'status' => 'success',
            'message' => $notification->is_active ? 'Notifikasi diaktifkan.' : 'Notifikasi dinonaktifkan.',
            'data' => $notification,
        ]);
    }

    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $notification = AdminNotification::findOrFail($id);
        $userId = $request->user()->id;
        $readBy = $notification->read_by ?? [];

        if (! in_array($userId, $readBy)) {
            $readBy[] = $userId;
            $notification->update(['read_by' => $readBy]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Notifikasi ditandai sudah dibaca.',
            'data' => $notification,
        ]);
    }
}
