<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Booking\Http\Resources\BookingCalendarResource;
use App\Modules\Booking\Services\BookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CalendarController extends Controller
{
    public function __construct(
        private readonly BookingService $bookingService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'start' => 'required|date',
            'end' => 'required|date|after:start',
            'branch_id' => 'nullable|string|exists:branches,id',
            'staff_id' => 'nullable|string|exists:staff,id',
        ]);

        $events = $this->bookingService->getCalendarEvents(
            $request->input('start'),
            $request->input('end'),
            $request->input('branch_id'),
            $request->input('staff_id'),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => BookingCalendarResource::collection($events),
        ]);
    }
}
