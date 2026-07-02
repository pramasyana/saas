<?php

declare(strict_types=1);

namespace App\Modules\Service\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Service\Http\Requests\StorePackageRequest;
use App\Modules\Service\Http\Requests\UpdatePackageRequest;
use App\Modules\Service\Http\Resources\PackageResource;
use App\Modules\Service\Services\PackageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    public function __construct(
        private readonly PackageService $packageService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $branchId = $request->input('branch_id');

        $packages = $this->packageService->paginate(
            $request->only(['search', 'is_active', 'sort', 'direction']),
            $branchId,
            (int) $request->input('per_page', 15),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => PackageResource::collection($packages),
            'meta' => [
                'current_page' => $packages->currentPage(),
                'last_page' => $packages->lastPage(),
                'per_page' => $packages->perPage(),
                'total' => $packages->total(),
            ],
        ]);
    }

    public function all(): JsonResponse
    {
        $packages = $this->packageService->findAll();

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => PackageResource::collection($packages),
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $package = $this->packageService->findById($id);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => new PackageResource($package),
        ]);
    }

    public function store(StorePackageRequest $request): JsonResponse
    {
        $package = $this->packageService->create($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Paket berhasil ditambahkan.',
            'data' => new PackageResource($package),
        ], 201);
    }

    public function update(UpdatePackageRequest $request, string $id): JsonResponse
    {
        $package = $this->packageService->update($id, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Paket berhasil diupdate.',
            'data' => new PackageResource($package),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $this->packageService->delete($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Paket berhasil dihapus.',
        ]);
    }
}
