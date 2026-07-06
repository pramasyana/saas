<?php

namespace App\Modules\Admin\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(): JsonResponse
    {
        $notifications = AdminNotification::orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => $notifications,
        ]);
    }

    public function active(): JsonResponse
    {
        $notifications = AdminNotification::where('is_active', true)
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
}
