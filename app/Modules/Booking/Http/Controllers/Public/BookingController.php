<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Controllers\Public;

use App\Modules\Booking\Models\Booking;
use App\Modules\Company\Models\Branch;
use App\Modules\Service\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController
{
    public function index(Request $request): Response|RedirectResponse
    {
        // If the user is already authenticated (e.g. staff logged in on central),
        // redirect to the admin booking page instead of showing the public one.
        if ($request->user()) {
            return redirect()->route('tenant.booking.index');
        }

        $tenant = tenant();
        $config = $tenant->getInternal('booking_config') ?? [];

        if (! ($config['enabled'] ?? false)) {
            return Inertia::render('public/booking/Disabled');
        }

        $tenantId = $tenant->getTenantKey();

        $branches = Branch::where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'address', 'phone']);

        $services = Service::where('is_active', true)
            ->with('category')
            ->orderBy('name')
            ->get(['id', 'name', 'description', 'duration', 'price', 'color', 'category_id']);

        return Inertia::render('public/booking/index', [
            'branches' => $branches,
            'services' => $services,
            'settings' => [
                'show_prices' => $config['show_prices'] ?? true,
            ],
            'tenant' => [
                'name' => $tenant->company_name ?? 'Booking',
                'logo' => null,
            ],
        ]);
    }

    public function confirmation(string $code): Response|RedirectResponse
    {
        $tenant = tenant();
        $config = $tenant->getInternal('booking_config') ?? [];

        if (! ($config['enabled'] ?? false)) {
            return Inertia::render('public/booking/Disabled');
        }

        $booking = Booking::where('booking_code', $code)
            ->with(['customer', 'staff', 'branch', 'services'])
            ->firstOrFail();

        return Inertia::render('public/booking/Confirmation', [
            'booking' => [
                'id' => $booking->id,
                'booking_code' => $booking->booking_code,
                'status' => $booking->status,
                'customer_name' => $booking->customer?->name,
                'staff_name' => $booking->staff?->name,
                'branch_name' => $booking->branch?->name,
                'start_time' => $booking->start_time,
                'end_time' => $booking->end_time,
                'duration_minutes' => $booking->duration_minutes,
                'source' => $booking->source,
                'notes' => $booking->notes,
                'services' => $booking->services->map(fn ($s) => [
                    'name' => $s->name,
                    'price' => $s->price,
                    'duration' => $s->duration,
                    'quantity' => $s->quantity,
                ]),
            ],
            'tenant' => [
                'name' => $tenant->company_name ?? 'Booking',
            ],
        ]);
    }
}
