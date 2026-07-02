<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Modules\Booking\Services\BookingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function __construct(
        private readonly BookingService $bookingService,
    ) {}

    public function index(Request $request): Response
    {
        $stats = $this->bookingService->getStats();

        return Inertia::render('tenant/booking/Index', [
            'title' => 'Booking',
            'stats' => $stats,
        ]);
    }

    public function walkIn(): Response
    {
        return Inertia::render('tenant/booking/WalkIn', [
            'title' => 'Walk In Booking',
        ]);
    }

    public function waitingList(): Response
    {
        return Inertia::render('tenant/booking/WaitingList', [
            'title' => 'Waiting List',
        ]);
    }
}
