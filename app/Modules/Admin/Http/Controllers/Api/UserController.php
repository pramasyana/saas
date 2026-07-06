<?php

namespace App\Modules\Admin\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Admin\Http\Requests\User\StoreUserRequest;
use App\Modules\Admin\Http\Requests\User\UpdateUserRequest;
use App\Modules\Admin\Http\Resources\UserResource;
use App\Modules\Admin\Services\ActivityLogService;
use App\Modules\Admin\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(
        private readonly UserService $userService,
        private readonly ActivityLogService $logService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $users = $this->userService->paginate(
            $request->only(['search', 'is_admin', 'sort', 'direction']),
            (int) $request->input('per_page', 15),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => UserResource::collection($users),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ]);
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = $this->userService->create($request->validated());

        $this->logService->logFromRequest($request, 'created', 'Membuat user baru: '.$user->name, 'user', $user->id);

        return response()->json([
            'status' => 'success',
            'message' => 'User berhasil dibuat.',
            'data' => new UserResource($user),
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $user = $this->userService->findById($id);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => new UserResource($user),
        ]);
    }

    public function update(UpdateUserRequest $request, string $id): JsonResponse
    {
        $user = $this->userService->update($id, $request->validated());

        $this->logService->logFromRequest($request, 'updated', 'Mengupdate user: '.$user->name, 'user', $user->id);

        return response()->json([
            'status' => 'success',
            'message' => 'User berhasil diupdate.',
            'data' => new UserResource($user),
        ]);
    }

    public function toggleActive(Request $request, string $id): JsonResponse
    {
        $user = $this->userService->toggleActive($id);

        $this->logService->logFromRequest($request, 'toggled-active', ($user->is_active ? 'Mengaktifkan' : 'Menonaktifkan').' user: '.$user->name, 'user', $user->id);

        return response()->json([
            'status' => 'success',
            'message' => $user->is_active ? 'User diaktifkan.' : 'User dinonaktifkan.',
            'data' => new UserResource($user),
        ]);
    }

    public function resendVerification(string $id): JsonResponse
    {
        try {
            $this->userService->resendVerification($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Email verifikasi berhasil dikirim.',
            ]);
        } catch (\RuntimeException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function emailLogs(string $id): JsonResponse
    {
        $logs = $this->userService->getEmailLogs($id);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => $logs,
        ]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        try {
            $user = $this->userService->findById($id);
            $userName = $user->name;

            $this->userService->delete($id);

            $this->logService->logFromRequest($request, 'deleted', 'Menghapus user: '.$userName, 'user', $id);

            return response()->json([
                'status' => 'success',
                'message' => 'User berhasil dihapus.',
            ]);
        } catch (\RuntimeException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
