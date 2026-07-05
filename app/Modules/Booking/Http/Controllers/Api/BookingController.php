<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Booking\Http\Requests\RescheduleBookingRequest;
use App\Modules\Booking\Http\Requests\StoreBookingRequest;
use App\Modules\Booking\Http\Requests\UpdateBookingRequest;
use App\Modules\Booking\Http\Resources\BookingResource;
use App\Modules\Booking\Services\BookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function __construct(
        private readonly BookingService $bookingService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $branchId = $request->input('branch_id');

        $bookings = $this->bookingService->paginate(
            $request->only(['search', 'status', 'date', 'staff_id', 'source', 'customer_id']),
            $branchId,
            (int) $request->input('per_page', 15),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => BookingResource::collection($bookings),
            'meta' => [
                'current_page' => $bookings->currentPage(),
                'last_page' => $bookings->lastPage(),
                'per_page' => $bookings->perPage(),
                'total' => $bookings->total(),
            ],
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $booking = $this->bookingService->findById($id);

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => new BookingResource($booking),
        ]);
    }

    public function store(StoreBookingRequest $request): JsonResponse
    {
        $booking = $this->bookingService->create($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Booking berhasil dibuat.',
            'data' => new BookingResource($booking),
        ], 201);
    }

    public function update(UpdateBookingRequest $request, string $id): JsonResponse
    {
        $booking = $this->bookingService->update($id, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Booking berhasil diupdate.',
            'data' => new BookingResource($booking),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $this->bookingService->delete($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Booking berhasil dihapus.',
        ]);
    }

    public function reschedule(RescheduleBookingRequest $request, string $id): JsonResponse
    {
        $booking = $this->bookingService->reschedule($id, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Booking berhasil dijadwalkan ulang.',
            'data' => new BookingResource($booking),
        ]);
    }

    public function noShow(string $id): JsonResponse
    {
        $booking = $this->bookingService->markNoShow($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Booking ditandai no-show.',
            'data' => new BookingResource($booking),
        ]);
    }

    public function checkIn(string $id): JsonResponse
    {
        $booking = $this->bookingService->checkIn($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Check-in berhasil.',
            'data' => new BookingResource($booking),
        ]);
    }

    public function complete(string $id): JsonResponse
    {
        $booking = $this->bookingService->complete($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Booking selesai.',
            'data' => new BookingResource($booking),
        ]);
    }

    public function confirm(string $id): JsonResponse
    {
        $booking = $this->bookingService->confirm($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Booking dikonfirmasi.',
            'data' => new BookingResource($booking),
        ]);
    }

    public function cancel(string $id): JsonResponse
    {
        $booking = $this->bookingService->cancel($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Booking dibatalkan.',
            'data' => new BookingResource($booking),
        ]);
    }

    public function stats(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => $this->bookingService->getStats(),
        ]);
    }

    public function getSettings(): JsonResponse
    {
        $tenant = tenant();
        $config = $tenant->getInternal('booking_config') ?? [];

        return response()->json([
            'status' => 'success',
            'message' => 'OK',
            'data' => [
                'enabled' => $config['enabled'] ?? false,
                'show_prices' => $config['show_prices'] ?? true,
                'auto_confirm' => $config['auto_confirm'] ?? false,
                'enable_addons' => $config['enable_addons'] ?? false,
                'enable_multi_service' => $config['enable_multi_service'] ?? false,
                'enable_guests' => $config['enable_guests'] ?? false,
                'enable_rooms' => $config['enable_rooms'] ?? false,
                'enable_staff_filter' => $config['enable_staff_filter'] ?? true,
                'enable_group_booking' => $config['enable_group_booking'] ?? false,
                'enable_recurring_public' => $config['enable_recurring_public'] ?? false,
            ],
        ]);
    }

    public function updateSettings(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'enabled' => 'boolean',
            'show_prices' => 'boolean',
            'auto_confirm' => 'boolean',
            'enable_addons' => 'boolean',
            'enable_multi_service' => 'boolean',
            'enable_guests' => 'boolean',
            'enable_rooms' => 'boolean',
            'enable_staff_filter' => 'boolean',
            'enable_group_booking' => 'boolean',
            'enable_recurring_public' => 'boolean',
        ]);

        $tenant = tenant();
        $config = $tenant->getInternal('booking_config') ?? [];
        $config = array_merge($config, $validated);
        $tenant->setInternal('booking_config', $config);
        $tenant->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Pengaturan online booking berhasil disimpan.',
            'data' => $config,
        ]);
    }
}
