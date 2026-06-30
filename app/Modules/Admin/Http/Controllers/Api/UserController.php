<?php

namespace App\Modules\Admin\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Admin\Http\Requests\User\StoreUserRequest;
use App\Modules\Admin\Http\Requests\User\UpdateUserRequest;
use App\Modules\Admin\Http\Resources\UserResource;
use App\Modules\Admin\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(
        private readonly UserService $userService,
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

        return response()->json([
            'status' => 'success',
            'message' => 'User berhasil dibuat.',
            'data' => new UserResource($user),
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $user = $this->userService->findById($id);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => new UserResource($user),
        ]);
    }

    public function update(UpdateUserRequest $request, int $id): JsonResponse
    {
        $user = $this->userService->update($id, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'User berhasil diupdate.',
            'data' => new UserResource($user),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->userService->delete($id);

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
