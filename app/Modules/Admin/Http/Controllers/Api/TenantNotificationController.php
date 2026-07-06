<?php

namespace App\Modules\Admin\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Admin\Services\ActivityLogService;
use App\Modules\Admin\Services\TenantNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TenantNotificationController extends Controller
{
    public function __construct(
        private readonly TenantNotificationService $notificationService,
        private readonly ActivityLogService $logService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $notifications = $this->notificationService->paginate(
            $request->only(['search', 'type', 'is_active']),
            (int) $request->input('per_page', 15),
        );

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

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'required|in:info,warning,success,danger',
            'is_active' => 'boolean',
            'target_type' => 'required|in:all,specific',
            'target_tenant_ids' => 'required_if:target_type,specific|array',
            'target_tenant_ids.*' => 'string',
            'active_from' => 'nullable|date',
            'active_until' => 'nullable|date|after_or_equal:active_from',
        ]);

        $notification = $this->notificationService->create($validated);

        $this->logService->logFromRequest($request, 'created', 'Membuat notifikasi tenant: '.$notification->title, 'admin_tenant_notification', $notification->id);

        return response()->json([
            'status' => 'success',
            'message' => 'Notifikasi tenant berhasil dibuat.',
            'data' => $notification,
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $notification = $this->notificationService->findById($id);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => $notification,
        ]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'required|in:info,warning,success,danger',
            'is_active' => 'boolean',
            'target_type' => 'required|in:all,specific',
            'target_tenant_ids' => 'required_if:target_type,specific|array',
            'target_tenant_ids.*' => 'string',
            'active_from' => 'nullable|date',
            'active_until' => 'nullable|date|after_or_equal:active_from',
        ]);

        $notification = $this->notificationService->update($id, $validated);

        $this->logService->logFromRequest($request, 'updated', 'Mengupdate notifikasi tenant: '.$notification->title, 'admin_tenant_notification', $notification->id);

        return response()->json([
            'status' => 'success',
            'message' => 'Notifikasi tenant berhasil diperbarui.',
            'data' => $notification,
        ]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $notification = $this->notificationService->findById($id);
        $title = $notification->title;

        $this->notificationService->delete($id);

        $this->logService->logFromRequest($request, 'deleted', 'Menghapus notifikasi tenant: '.$title, 'admin_tenant_notification', $id);

        return response()->json([
            'status' => 'success',
            'message' => 'Notifikasi tenant berhasil dihapus.',
        ]);
    }

    public function toggleActive(Request $request, string $id): JsonResponse
    {
        $notification = $this->notificationService->toggleActive($id);

        $this->logService->logFromRequest($request, 'toggled-active', ($notification->is_active ? 'Mengaktifkan' : 'Menonaktifkan').' notifikasi tenant: '.$notification->title, 'admin_tenant_notification', $notification->id);

        return response()->json([
            'status' => 'success',
            'message' => $notification->is_active ? 'Notifikasi diaktifkan.' : 'Notifikasi dinonaktifkan.',
            'data' => $notification,
        ]);
    }

    public function forTenant(Request $request): JsonResponse
    {
        $tenantId = $request->user()->tenant_id;

        if (! $tenantId) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tenant tidak ditemukan.',
            ], 404);
        }

        $notifications = $this->notificationService->getActiveForTenant($tenantId);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => $notifications,
        ]);
    }

    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $tenantId = $request->user()->tenant_id;

        if (! $tenantId) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tenant tidak ditemukan.',
            ], 404);
        }

        $notification = $this->notificationService->markAsRead($id, $tenantId);

        return response()->json([
            'status' => 'success',
            'message' => 'Notifikasi ditandai sudah dibaca.',
            'data' => $notification,
        ]);
    }
}
