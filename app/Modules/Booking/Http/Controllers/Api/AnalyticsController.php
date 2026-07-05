<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Booking\Services\BookingService;
use Illuminate\Http\JsonResponse;

class AnalyticsController extends Controller
{
    public function __construct(
        private readonly BookingService $bookingService,
    ) {}

    public function overview(): JsonResponse
    {
        $bookingStats = $this->bookingService->getStats();
        $analytics = $this->bookingService->getAnalytics();

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => array_merge($bookingStats, $analytics),
        ]);
    }
}
