<?php

declare(strict_types=1);

namespace App\Modules\Company\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Company\Http\Requests\StoreHolidayRequest;
use App\Modules\Company\Http\Requests\UpdateHolidayRequest;
use App\Modules\Company\Http\Resources\HolidayResource;
use App\Modules\Company\Services\CompanyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HolidayController extends Controller
{
    public function __construct(
        private readonly CompanyService $companyService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;
        $filters = $request->only(['search', 'branch_id', 'year', 'upcoming', 'sort', 'direction', 'per_page']);
        $holidays = $this->companyService->getHolidays($tenantId, $filters);

        return response()->json([
            'status' => 'success',
            'data' => HolidayResource::collection($holidays->items()),
            'meta' => [
                'current_page' => $holidays->currentPage(),
                'last_page' => $holidays->lastPage(),
                'per_page' => $holidays->perPage(),
                'total' => $holidays->total(),
            ],
        ]);
    }

    public function store(StoreHolidayRequest $request): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;
        $holiday = $this->companyService->createHoliday($tenantId, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Hari libur berhasil ditambahkan.',
            'data' => new HolidayResource($holiday),
        ], 201);
    }

    public function update(string $id, UpdateHolidayRequest $request): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;
        $holiday = $this->companyService->updateHoliday($tenantId, $id, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Hari libur berhasil diperbarui.',
            'data' => new HolidayResource($holiday),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;
        $this->companyService->deleteHoliday($tenantId, $id);

        return response()->json([
            'status' => 'success',
            'message' => 'Hari libur berhasil dihapus.',
        ]);
    }
}
