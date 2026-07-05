<?php

declare(strict_types=1);

namespace App\Modules\Staff\Http\Controllers\Api;

use App\Modules\Staff\Models\Staff;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class StaffServiceController extends Controller
{
    public function index(Staff $staff): JsonResponse
    {
        $staff->load('services');

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => $staff->services->map(fn ($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'is_primary' => (bool) $s->pivot->is_primary,
            ]),
        ]);
    }

    public function sync(Request $request, Staff $staff): JsonResponse
    {
        $validated = $request->validate([
            'services' => 'required|array',
            'services.*.id' => 'required|string|exists:services,id',
            'services.*.is_primary' => 'boolean',
        ]);

        $sync = [];
        foreach ($validated['services'] as $svc) {
            $sync[$svc['id']] = ['is_primary' => $svc['is_primary'] ?? false];
        }

        $staff->services()->sync($sync);

        return response()->json([
            'status' => 'success',
            'message' => 'Staff services updated',
        ]);
    }
}
