<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Booking\Http\Requests\CheckAvailabilityRequest;
use App\Modules\Booking\Http\Resources\AvailabilityResource;
use App\Modules\Booking\Services\AvailabilityService;
use Illuminate\Http\JsonResponse;

class AvailabilityController extends Controller
{
    public function __construct(
        private readonly AvailabilityService $availabilityService,
    ) {}

    public function check(CheckAvailabilityRequest $request): JsonResponse
    {
        $data = $request->validated();

        $result = $this->availabilityService->getAvailableSlots(
            $data['date'],
            $data['service_id'],
            (int) $data['duration'],
            $data['branch_id'] ?? null,
            $data['staff_id'] ?? null,
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => new AvailabilityResource($result),
        ]);
    }
}
