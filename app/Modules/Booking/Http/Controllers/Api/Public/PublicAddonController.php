<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Controllers\Api\Public;

use App\Modules\Service\Models\Addon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicAddonController
{
    public function index(Request $request): JsonResponse
    {
        $config = tenant()->getInternal('booking_config') ?? [];

        if (! ($config['enabled'] ?? false)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Booking online sedang tidak aktif.',
            ], 403);
        }

        $addons = Addon::where('is_active', true);

        if ($request->filled('branch_id')) {
            $addons->where('branch_id', $request->branch_id);
        }

        return response()->json([
            'status' => 'success',
            'data' => $addons->get(['id', 'name', 'description', 'price', 'duration']),
        ]);
    }
}
