<?php

declare(strict_types=1);

namespace App\Modules\Admin\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CentralSetting;
use App\Modules\Admin\Services\ActivityLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function __construct(
        private readonly ActivityLogService $logService,
    ) {}

    public function index(): JsonResponse
    {
        $baseDomain = CentralSetting::get('base_domain', config('app.domain', 'localhost'));

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => [
                'base_domain' => $baseDomain,
            ],
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'base_domain' => 'required|string|max:255|regex:/^[a-z0-9\-\.]+$/',
        ]);

        CentralSetting::set('base_domain', $validated['base_domain']);

        $this->logService->logFromRequest($request, 'updated', 'Mengubah pengaturan: base_domain = '.$validated['base_domain'], 'settings');

        return response()->json([
            'status' => 'success',
            'message' => 'Pengaturan berhasil disimpan.',
            'data' => [
                'base_domain' => $validated['base_domain'],
            ],
        ]);
    }
}
