<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Controllers\Api\Public;

use App\Modules\Service\Models\Package;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicPackageController
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

        $query = Package::where('is_active', true)
            ->with('services');

        if ($request->filled('branch_id')) {
            $query->where('branch_id', $request->branch_id);
        }

        $packages = $query->orderBy('name')->get(['id', 'name', 'description', 'price', 'duration', 'branch_id']);

        $packages = $packages->map(fn ($p) => [
            'id' => $p->id,
            'name' => $p->name,
            'description' => $p->description,
            'price' => (float) $p->price,
            'duration' => $p->duration,
            'branch_id' => $p->branch_id,
            'services' => $p->services->map(fn ($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'quantity' => $s->pivot->quantity,
            ]),
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $packages,
        ]);
    }
}
