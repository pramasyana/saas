<?php

declare(strict_types=1);

namespace App\Modules\Crm\Http\Controllers\Api;

use App\Modules\Crm\Http\Requests\UpdateLoyaltyConfigRequest;
use Illuminate\Http\JsonResponse;

class LoyaltySettingsController
{
    public function show(): JsonResponse
    {
        $config = tenant()->getInternal('loyalty_config') ?? [
            'enabled' => true,
            'mode' => 'percentage',
            'points_per_amount' => 1000,
            'points_fixed' => 10,
        ];

        return response()->json([
            'status' => 'success',
            'data' => $config,
        ]);
    }

    public function update(UpdateLoyaltyConfigRequest $request): JsonResponse
    {
        $config = [
            'enabled' => $request->boolean('enabled', true),
            'mode' => $request->input('mode', 'percentage'),
            'points_per_amount' => (int) $request->input('points_per_amount', 1000),
            'points_fixed' => (int) $request->input('points_fixed', 10),
        ];

        tenant()->setInternal('loyalty_config', $config);

        return response()->json([
            'status' => 'success',
            'message' => 'Konfigurasi loyalty berhasil disimpan.',
            'data' => $config,
        ]);
    }
}
