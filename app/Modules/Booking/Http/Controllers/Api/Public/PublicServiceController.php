<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Controllers\Api\Public;

use App\Modules\Service\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicServiceController
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

        $query = Service::where('is_active', true)
            ->with('category');

        if ($request->filled('branch_id')) {
            $query->where('branch_id', $request->branch_id);
        }

        $services = $query->orderBy('name')->get(['id', 'name', 'description', 'duration', 'price', 'color', 'category_id']);

        return response()->json([
            'status' => 'success',
            'data' => $services,
        ]);
    }
}
