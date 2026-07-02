<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Controllers\Api\Public;

use App\Modules\Company\Models\Branch;
use Illuminate\Http\JsonResponse;

class PublicBranchController
{
    public function index(): JsonResponse
    {
        $config = tenant()->getInternal('booking_config') ?? [];

        if (! ($config['enabled'] ?? false)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Booking online sedang tidak aktif.',
            ], 403);
        }

        $branches = Branch::where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'address', 'phone']);

        return response()->json([
            'status' => 'success',
            'data' => $branches,
        ]);
    }
}
