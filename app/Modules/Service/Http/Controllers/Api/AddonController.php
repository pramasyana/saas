<?php

declare(strict_types=1);

namespace App\Modules\Service\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Service\Http\Requests\StoreAddonRequest;
use App\Modules\Service\Http\Requests\UpdateAddonRequest;
use App\Modules\Service\Http\Resources\AddonResource;
use App\Modules\Service\Services\AddonService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AddonController extends Controller
{
    public function __construct(
        private readonly AddonService $addonService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $addons = $this->addonService->paginate(
            $request->only(['search', 'is_active', 'sort', 'direction']),
            (int) $request->input('per_page', 15),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => AddonResource::collection($addons),
            'meta' => [
                'current_page' => $addons->currentPage(),
                'last_page' => $addons->lastPage(),
                'per_page' => $addons->perPage(),
                'total' => $addons->total(),
            ],
        ]);
    }

    public function all(): JsonResponse
    {
        $addons = $this->addonService->findAll();

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => AddonResource::collection($addons),
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $addon = $this->addonService->findById($id);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => new AddonResource($addon),
        ]);
    }

    public function store(StoreAddonRequest $request): JsonResponse
    {
        $addon = $this->addonService->create($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Add-on berhasil ditambahkan.',
            'data' => new AddonResource($addon),
        ], 201);
    }

    public function update(UpdateAddonRequest $request, string $id): JsonResponse
    {
        $addon = $this->addonService->update($id, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Add-on berhasil diupdate.',
            'data' => new AddonResource($addon),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $this->addonService->delete($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Add-on berhasil dihapus.',
        ]);
    }
}
