<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Controllers\Public;

use App\Modules\Booking\Models\Booking;
use App\Modules\Company\Models\Branch;
use App\Modules\Service\Models\Addon;
use App\Modules\Service\Models\Category;
use App\Modules\Service\Models\Package;
use App\Modules\Service\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController
{
    public function index(Request $request): Response|RedirectResponse
    {
        if ($request->user()) {
            return redirect()->route('tenant.booking.index');
        }

        $tenant = tenant();

        if (! $tenant) {
            abort(404);
        }

        $landingConfig = $tenant->getInternal('landing_config') ?? [];
        $bookingConfig = $tenant->getInternal('booking_config') ?? [];

        if (! ($bookingConfig['enabled'] ?? false)) {
            return Inertia::render('public/booking/Disabled', [
                'colors' => $landingConfig['colors'] ?? null,
                'tenant' => [
                    'name' => $tenant->company_name ?? 'Booking',
                    'logo' => null,
                ],
            ]);
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

        $categories = Category::where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'name', 'slug', 'color']);

        $packages = Package::where('is_active', true)
            ->with('services')
            ->orderBy('name')
            ->get(['id', 'name', 'description', 'price', 'duration', 'branch_id'])
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'description' => $p->description,
                'price' => (float) $p->price,
                'duration' => $p->duration,
                'branch_id' => $p->branch_id,
                'services' => $p->services->map(fn ($s) => [
                    'id' => $s->id,
                    'name' => $s->name,
                    'quantity' => $s->pivot->quantity,
                ]),
            ]);

        $addons = Addon::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'description', 'price', 'duration']);

        return Inertia::render('public/booking/index', [
            'branches' => $branches,
            'services' => $services,
            'packages' => $packages,
            'categories' => $categories,
            'addons' => $addons,
            'settings' => [
                'show_prices' => $bookingConfig['show_prices'] ?? true,
                'enable_addons' => $bookingConfig['enable_addons'] ?? false,
                'enable_multi_service' => $bookingConfig['enable_multi_service'] ?? false,
                'enable_guests' => $bookingConfig['enable_guests'] ?? false,
            ],
            'colors' => $landingConfig['colors'] ?? null,
            'tenant' => [
                'name' => $tenant->company_name ?? 'Booking',
                'logo' => null,
            ],
        ]);
    }

    public function confirmation(string $code): Response|RedirectResponse
    {
        $tenant = tenant();

        if (! $tenant) {
            abort(404);
        }

        $landingConfig = $tenant->getInternal('landing_config') ?? [];
        $bookingConfig = $tenant->getInternal('booking_config') ?? [];

        if (! ($bookingConfig['enabled'] ?? false)) {
            return Inertia::render('public/booking/Disabled', [
                'colors' => $landingConfig['colors'] ?? null,
                'tenant' => [
                    'name' => $tenant->company_name ?? 'Booking',
                ],
            ]);
        }

        $booking = Booking::where('booking_code', $code)
            ->with(['customer', 'staff', 'branch', 'services.addons'])
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
                'total_guests' => $booking->total_guests,
                'guest_details' => $booking->guest_details,
                'services' => $booking->services->map(fn ($s) => [
                    'name' => $s->name,
                    'price' => $s->price,
                    'duration' => $s->duration,
                    'quantity' => $s->quantity,
                    'addons' => $s->addons->map(fn ($a) => [
                        'name' => $a->name,
                        'price' => $a->price,
                        'quantity' => $a->quantity,
                    ]),
                ]),
            ],
            'colors' => $landingConfig['colors'] ?? null,
            'tenant' => [
                'name' => $tenant->company_name ?? 'Booking',
            ],
        ]);
    }
}
