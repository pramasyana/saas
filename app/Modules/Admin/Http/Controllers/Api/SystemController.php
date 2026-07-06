<?php

namespace App\Modules\Admin\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Admin\Services\SystemHealthService;
use Illuminate\Http\JsonResponse;

class SystemController extends Controller
{
    public function __construct(
        private readonly SystemHealthService $systemHealthService,
    ) {}

    public function index(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => $this->systemHealthService->getOverview(),
        ]);
    }

    public function toggleMaintenance(): JsonResponse
    {
        $maintenance = $this->systemHealthService->toggleMaintenance();

        return response()->json([
            'status' => 'success',
            'message' => $maintenance['active'] ? 'Mode maintenance diaktifkan.' : 'Mode maintenance dinonaktifkan.',
            'data' => $maintenance,
        ]);
    }
}
