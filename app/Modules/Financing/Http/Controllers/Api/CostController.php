<?php

declare(strict_types=1);

namespace App\Modules\Financing\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Financing\Contracts\CostRepositoryInterface;
use App\Modules\Financing\Http\Requests\StoreCostRequest;
use App\Modules\Financing\Http\Resources\CostResource;
use App\Modules\Financing\Services\FinancingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CostController extends Controller
{
    public function __construct(
        private readonly CostRepositoryInterface $costRepository,
        private readonly FinancingService $financingService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $tenantId = $request->user()->tenant_id;
        $costs = $this->costRepository->paginate(
            $tenantId,
            $request->only(['search', 'category_id', 'date_from', 'date_to']),
            (int) $request->input('per_page', 15),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => CostResource::collection($costs),
            'meta' => [
                'current_page' => $costs->currentPage(),
                'last_page' => $costs->lastPage(),
                'per_page' => $costs->perPage(),
                'total' => $costs->total(),
            ],
        ]);
    }

    public function store(StoreCostRequest $request): JsonResponse
    {
        $tenantId = $request->user()->tenant_id;
        $cost = $this->costRepository->create([
            ...$request->validated(),
            'tenant_id' => $tenantId,
            'created_by' => $request->user()->id,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Biaya berhasil ditambahkan.',
            'data' => new CostResource($cost->load(['category', 'creator'])),
        ], 201);
    }

    public function update(StoreCostRequest $request, string $id): JsonResponse
    {
        $cost = $this->costRepository->findOrFail($id);
        $updated = $this->costRepository->update($cost, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Biaya berhasil diupdate.',
            'data' => new CostResource($updated->load(['category', 'creator'])),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $cost = $this->costRepository->findOrFail($id);
        $this->costRepository->delete($cost);

        return response()->json([
            'status' => 'success',
            'message' => 'Biaya berhasil dihapus.',
        ]);
    }

    public function overview(Request $request): JsonResponse
    {
        $tenantId = $request->user()->tenant_id;
        $overview = $this->financingService->getOverview(
            $tenantId,
            $request->input('start_date'),
            $request->input('end_date'),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => $overview,
        ]);
    }

    public function monthly(Request $request): JsonResponse
    {
        $tenantId = $request->user()->tenant_id;
        $months = (int) $request->input('months', 12);
        $data = $this->financingService->getMonthlyData($tenantId, $months);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => $data,
        ]);
    }

    public function breakdown(Request $request): JsonResponse
    {
        $tenantId = $request->user()->tenant_id;
        $data = $this->financingService->getCostBreakdown(
            $tenantId,
            $request->input('start_date'),
            $request->input('end_date'),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => $data,
        ]);
    }

    public function stats(Request $request): JsonResponse
    {
        $tenantId = $request->user()->tenant_id;
        $stats = $this->financingService->getStats($tenantId);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => $stats,
        ]);
    }

    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'csv_data' => 'required|string',
        ]);

        $tenantId = $request->user()->tenant_id;
        $createdBy = $request->user()->id;
        $rows = $this->parseCsv($request->input('csv_data'));
        $imported = $this->financingService->importCosts($tenantId, $createdBy, $rows);

        return response()->json([
            'status' => 'success',
            'message' => "{$imported} biaya berhasil diimport.",
            'data' => ['imported' => $imported],
        ]);
    }

    private function parseCsv(string $csvData): array
    {
        $lines = array_filter(explode("\n", $csvData));
        $headers = [];
        $rows = [];

        foreach ($lines as $index => $line) {
            $line = trim($line);
            if ($line === '') {
                continue;
            }

            $values = str_getcsv($line);

            if ($index === 0) {
                $headers = array_map('strtolower', array_map('trim', $values));
                continue;
            }

            $row = array_combine($headers, $values);
            $rows[] = $row;
        }

        return $rows;
    }
}
