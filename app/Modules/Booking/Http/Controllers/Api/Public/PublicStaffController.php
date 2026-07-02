<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Controllers\Api\Public;

use App\Modules\Staff\Models\Staff;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicStaffController
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

        $query = Staff::where('is_active', true)->with('branch');

        if ($request->filled('branch_id')) {
            $query->where('branch_id', $request->branch_id);
        }

        if ($request->filled('date')) {
            $dayOfWeek = (int) date('N', strtotime($request->date));

            $query->whereHas('schedules', function ($q) use ($dayOfWeek): void {
                $q->where('day_of_week', $dayOfWeek)
                    ->where('is_active', true);
            });
        }

        $staff = $query->orderBy('name')->get(['id', 'name', 'email', 'phone', 'position', 'branch_id']);

        return response()->json([
            'status' => 'success',
            'data' => $staff,
        ]);
    }
}
