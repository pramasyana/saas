<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Controllers\Api\Public;

use App\Modules\Booking\Http\Requests\CheckAvailabilityRequest;
use App\Modules\Booking\Services\AvailabilityService;
use Illuminate\Http\JsonResponse;

class PublicAvailabilityController
{
    public function __construct(
        private readonly AvailabilityService $availabilityService,
    ) {}

    public function check(CheckAvailabilityRequest $request): JsonResponse
    {
        $config = tenant()->getInternal('booking_config') ?? [];

        if (! ($config['enabled'] ?? false)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Booking online sedang tidak aktif.',
            ], 403);
        }

        $result = $this->availabilityService->getAvailableSlots(
            date: $request->date,
            serviceId: $request->service_id,
            duration: (int) $request->duration,
            branchId: $request->branch_id,
            staffId: $request->staff_id,
        );

        return response()->json([
            'status' => 'success',
            'data' => $result,
        ]);
    }
}
