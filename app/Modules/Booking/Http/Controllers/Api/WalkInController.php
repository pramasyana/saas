<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Booking\Http\Requests\StoreBookingRequest;
use App\Modules\Booking\Http\Resources\BookingResource;
use App\Modules\Booking\Services\BookingService;
use Illuminate\Http\JsonResponse;

class WalkInController extends Controller
{
    public function __construct(
        private readonly BookingService $bookingService,
    ) {}

    public function store(StoreBookingRequest $request): JsonResponse
    {
        $booking = $this->bookingService->walkIn($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Walk-in booking berhasil.',
            'data' => new BookingResource($booking),
        ], 201);
    }
}
