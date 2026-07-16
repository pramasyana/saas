<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Controllers\Api\Public;

use App\Modules\Booking\Actions\CreateBookingAction;
use App\Modules\Booking\Http\Requests\StorePublicBookingRequest;
use App\Modules\Booking\Models\Booking;
use App\Modules\Booking\Services\AvailabilityService;
use App\Modules\Crm\Models\Customer;
use App\Modules\Service\Models\Package;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class PublicBookingController
{
    public function __construct(
        private readonly CreateBookingAction $createBookingAction,
        private readonly AvailabilityService $availabilityService,
    ) {}

    public function store(StorePublicBookingRequest $request): JsonResponse
    {
        $tenant = tenant();
        $config = $tenant->getInternal('booking_config') ?? [];

        if (! ($config['enabled'] ?? false)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Booking online sedang tidak aktif.',
            ], 403);
        }

        $tenantId = $tenant->getTenantKey();

        $customer = Customer::where('email', $request->customer_email)->first();

        if (! $customer) {
            $customer = Customer::create([
                'tenant_id' => $tenantId,
                'name' => $request->customer_name,
                'email' => $request->customer_email,
                'phone' => $request->customer_phone,
            ]);
        }

        $duration = (int) $request->duration_minutes;
        $bookingServices = [];

        if ($request->filled('services')) {
            $bookingServices = $request->services;
        } elseif ($request->filled('package_id')) {
            $package = Package::with('services')->findOrFail($request->package_id);
            $duration = (int) $package->duration;

            foreach ($package->services as $svc) {
                $bookingServices[] = [
                    'service_id' => $svc->id,
                    'name' => $svc->name,
                    'price' => (float) $svc->price,
                    'duration' => (int) $svc->duration,
                    'quantity' => $svc->pivot->quantity ?? 1,
                ];
            }
        } elseif ($request->filled('service_id')) {
            $bookingServices[] = [
                'service_id' => $request->service_id,
                'name' => '',
                'price' => 0,
                'duration' => $duration,
                'quantity' => 1,
            ];
        }

        $firstServiceId = null;
        if (! empty($bookingServices)) {
            $firstServiceId = $bookingServices[0]['service_id'] ?? null;
        }

        $staffId = $request->staff_id;

        if (empty($staffId)) {
            $startDate = Carbon::parse($request->start_time)->format('Y-m-d');
            $slots = $this->availabilityService->getAvailableSlots(
                date: $startDate,
                serviceId: $firstServiceId ?? '',
                duration: $duration,
                branchId: $request->branch_id,
                customerId: $customer->id,
            );

            $matchedSlot = collect($slots['slots'] ?? [])
                ->firstWhere('start_time', $request->start_time);

            if ($matchedSlot && ! empty($matchedSlot['staff'])) {
                $staffId = $matchedSlot['staff'][0]['id'];
            } else {
                throw ValidationException::withMessages([
                    'start_time' => ['Tidak ada staff tersedia untuk jadwal tersebut.'],
                ]);
            }
        }

        $startTime = Carbon::parse($request->start_time);
        $endTime = $startTime->copy()->addMinutes($duration);

        $booking = $this->createBookingAction->execute([
            'tenant_id' => $tenantId,
            'branch_id' => $request->branch_id,
            'customer_id' => $customer->id,
            'staff_id' => $staffId,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'duration_minutes' => $duration,
            'status' => ($config['auto_confirm'] ?? false) ? 'confirmed' : 'pending',
            'source' => 'online',
            'notes' => $request->notes,
            'total_guests' => (int) ($request->total_guests ?? 1),
            'guest_details' => $request->guest_details,
            'services' => $bookingServices,
            'rooms' => $request->rooms ?? [],
            'is_group' => $request->boolean('is_group'),
            'max_participants' => $request->max_participants,
            'participants' => $request->participants ?? [],
            'recurring' => $request->recurring ?? [],
        ], $tenantId);

        return response()->json([
            'status' => 'success',
            'message' => 'Booking berhasil dibuat.',
            'data' => [
                'id' => $booking->id,
                'booking_code' => $booking->booking_code,
                'status' => $booking->status,
            ],
        ], 201);
    }

    public function show(string $code): JsonResponse
    {
        $booking = Booking::where('booking_code', $code)
            ->with(['customer', 'staff', 'branch', 'services.addons', 'services.staff', 'rooms', 'participants'])
            ->first();

        if (! $booking) {
            return response()->json([
                'status' => 'error',
                'message' => 'Booking tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'id' => $booking->id,
                'booking_code' => $booking->booking_code,
                'status' => $booking->status,
                'customer_name' => $booking->customer?->name,
                'customer_email' => $booking->customer?->email,
                'staff_name' => $booking->staff?->name,
                'branch_name' => $booking->branch?->name,
                'start_time' => $booking->start_time,
                'end_time' => $booking->end_time,
                'duration_minutes' => $booking->duration_minutes,
                'source' => $booking->source,
                'notes' => $booking->notes,
                'total_guests' => $booking->total_guests,
                'guest_details' => $booking->guest_details,
                'is_group' => $booking->is_group,
                'max_participants' => $booking->max_participants,
                'services' => $booking->services->map(fn ($s) => [
                    'name' => $s->name,
                    'price' => $s->price,
                    'duration' => $s->duration,
                    'quantity' => $s->quantity,
                    'staff_name' => $s->staff?->name,
                    'addons' => $s->addons->map(fn ($a) => [
                        'name' => $a->name,
                        'price' => $a->price,
                        'quantity' => $a->quantity,
                    ]),
                ]),
                'rooms' => $booking->rooms->map(fn ($r) => [
                    'id' => $r->id,
                    'name' => $r->name,
                    'color' => $r->color,
                ]),
                'participants' => $booking->participants->map(fn ($p) => [
                    'name' => $p->name,
                    'phone' => $p->phone,
                    'email' => $p->email,
                    'status' => $p->status,
                ]),
            ],
        ]);
    }
}
