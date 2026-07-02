<?php

declare(strict_types=1);

namespace App\Modules\Staff\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Staff\Http\Requests\StoreCommissionRequest;
use App\Modules\Staff\Http\Resources\CommissionResource;
use App\Modules\Staff\Services\StaffService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommissionController extends Controller
{
    public function __construct(
        private readonly StaffService $staffService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $commissions = $this->staffService->paginateCommissions(
            $request->only(['staff_id', 'type', 'date_from', 'date_to']),
            (int) $request->input('per_page', 15),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => CommissionResource::collection($commissions),
            'meta' => [
                'current_page' => $commissions->currentPage(),
                'last_page' => $commissions->lastPage(),
                'per_page' => $commissions->perPage(),
                'total' => $commissions->total(),
            ],
        ]);
    }

    public function store(StoreCommissionRequest $request): JsonResponse
    {
        $commission = $this->staffService->createCommission($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Komisi berhasil dicatat.',
            'data' => new CommissionResource($commission),
        ], 201);
    }

    public function update(StoreCommissionRequest $request, string $id): JsonResponse
    {
        $commission = $this->staffService->updateCommission($id, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Komisi berhasil diupdate.',
            'data' => new CommissionResource($commission),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $this->staffService->deleteCommission($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Komisi berhasil dihapus.',
        ]);
    }
}
