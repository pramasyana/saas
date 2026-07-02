<?php

declare(strict_types=1);

namespace App\Modules\Service\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Service\Http\Requests\StoreServiceRequest;
use App\Modules\Service\Http\Requests\UpdateServiceRequest;
use App\Modules\Service\Http\Resources\ServiceResource;
use App\Modules\Service\Services\ServiceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function __construct(
        private readonly ServiceService $serviceService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $services = $this->serviceService->paginate(
            $request->only(['search', 'category_id', 'is_active', 'sort', 'direction']),
            (int) $request->input('per_page', 15),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => ServiceResource::collection($services),
            'meta' => [
                'current_page' => $services->currentPage(),
                'last_page' => $services->lastPage(),
                'per_page' => $services->perPage(),
                'total' => $services->total(),
            ],
        ]);
    }

    public function all(): JsonResponse
    {
        $services = $this->serviceService->findAll();

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => ServiceResource::collection($services),
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $service = $this->serviceService->findById($id);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => new ServiceResource($service),
        ]);
    }

    public function store(StoreServiceRequest $request): JsonResponse
    {
        $service = $this->serviceService->create($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Layanan berhasil ditambahkan.',
            'data' => new ServiceResource($service),
        ], 201);
    }

    public function update(UpdateServiceRequest $request, string $id): JsonResponse
    {
        $service = $this->serviceService->update($id, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Layanan berhasil diupdate.',
            'data' => new ServiceResource($service),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $this->serviceService->delete($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Layanan berhasil dihapus.',
        ]);
    }
}
