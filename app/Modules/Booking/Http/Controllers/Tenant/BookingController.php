<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Modules\Booking\Contracts\BookingReminderRepositoryInterface;
use App\Modules\Booking\Services\BookingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function __construct(
        private readonly BookingService $bookingService,
        private readonly BookingReminderRepositoryInterface $reminderRepository,
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

    public function online(): Response
    {
        $tenant = tenant();
        $config = $tenant->getInternal('booking_config') ?? [];
        $domain = $tenant->domains()->first()?->domain ?? '';

        return Inertia::render('tenant/booking/Online', [
            'title' => 'Online Booking',
            'settings' => [
                'enabled' => $config['enabled'] ?? false,
                'show_prices' => $config['show_prices'] ?? true,
                'auto_confirm' => $config['auto_confirm'] ?? false,
            ],
            'publicUrl' => 'https://'.$domain.'/booking',
        ]);
    }

    public function reminders(): Response
    {
        $tenantId = tenant()->getTenantKey();
        $reminders = $this->reminderRepository->findByTenant($tenantId);

        return Inertia::render('tenant/booking/Reminders', [
            'title' => 'Monitoring Reminder',
            'stats' => [
                'total' => $reminders->count(),
                'pending' => $reminders->where('status', 'pending')->count(),
                'sent' => $reminders->where('status', 'sent')->count(),
                'failed' => $reminders->where('status', 'failed')->count(),
            ],
        ]);
    }
}
