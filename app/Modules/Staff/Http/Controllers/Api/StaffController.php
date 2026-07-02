<?php

declare(strict_types=1);

namespace App\Modules\Staff\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Staff\Http\Requests\StoreStaffRequest;
use App\Modules\Staff\Http\Requests\UpdateStaffRequest;
use App\Modules\Staff\Http\Resources\StaffResource;
use App\Modules\Staff\Services\StaffService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StaffController extends Controller
{
    public function __construct(
        private readonly StaffService $staffService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $staff = $this->staffService->paginateStaff(
            $request->only(['search', 'branch_id', 'is_active', 'sort', 'direction']),
            (int) $request->input('per_page', 15),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => StaffResource::collection($staff),
            'meta' => [
                'current_page' => $staff->currentPage(),
                'last_page' => $staff->lastPage(),
                'per_page' => $staff->perPage(),
                'total' => $staff->total(),
            ],
        ]);
    }

    public function all(Request $request): JsonResponse
    {
        $staff = $this->staffService->getAllStaff();

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => StaffResource::collection($staff),
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $staff = $this->staffService->getStaff($id);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => new StaffResource($staff->load('branch')),
        ]);
    }

    public function store(StoreStaffRequest $request): JsonResponse
    {
        $staff = $this->staffService->createStaff($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Staff berhasil ditambahkan.',
            'data' => new StaffResource($staff),
        ], 201);
    }

    public function update(UpdateStaffRequest $request, string $id): JsonResponse
    {
        $staff = $this->staffService->updateStaff($id, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Staff berhasil diupdate.',
            'data' => new StaffResource($staff),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $this->staffService->deleteStaff($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Staff berhasil dihapus.',
        ]);
    }
}
