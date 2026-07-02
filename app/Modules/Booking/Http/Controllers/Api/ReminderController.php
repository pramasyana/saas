<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Booking\Http\Resources\ReminderResource;
use App\Modules\Booking\Models\BookingReminder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReminderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = BookingReminder::with(['booking.customer'])
            ->whereHas('booking', fn ($q) => $q->where('tenant_id', tenant()->getTenantKey()));

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $reminders = $query->orderBy('created_at', 'desc')
            ->paginate((int) $request->input('per_page', 15));

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => ReminderResource::collection($reminders),
            'meta' => [
                'current_page' => $reminders->currentPage(),
                'last_page' => $reminders->lastPage(),
                'per_page' => $reminders->perPage(),
                'total' => $reminders->total(),
            ],
        ]);
    }
}
