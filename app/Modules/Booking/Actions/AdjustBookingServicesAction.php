<?php

declare(strict_types=1);

namespace App\Modules\Booking\Actions;

use App\Modules\Booking\Contracts\BookingRepositoryInterface;
use App\Modules\Booking\Contracts\BookingStatusLogRepositoryInterface;
use App\Modules\Booking\Events\BookingServicesAdjusted;
use App\Modules\Booking\Models\Booking;
use App\Modules\Booking\Models\BookingServiceAdjustment;
use Illuminate\Support\Facades\DB;

class AdjustBookingServicesAction
{
    public function __construct(
        private readonly BookingRepositoryInterface $bookingRepository,
        private readonly BookingStatusLogRepositoryInterface $statusLogRepository,
    ) {}

    public function execute(string $bookingId, array $adjustments, ?string $notes): Booking
    {
        return DB::transaction(function () use ($bookingId, $adjustments, $notes) {
            $booking = $this->bookingRepository->findOrFail($bookingId);

            $this->validateStatus($booking);

            $booking->load('services.addons');

            $oldServices = $booking->services->map(fn ($s) => [
                'id' => $s->id,
                'service_id' => $s->service_id,
                'name' => $s->name,
                'price' => (float) $s->price,
                'duration' => $s->duration,
                'quantity' => $s->quantity,
            ])->toArray();

            $oldTotal = $this->calculateTotal($booking->services);

            foreach ($adjustments as $adj) {
                match ($adj['action']) {
                    'add' => $this->handleAdd($booking, $adj),
                    'remove' => $this->handleRemove($booking, $adj),
                    'update_quantity' => $this->handleUpdateQuantity($booking, $adj),
                    'update_price' => $this->handleUpdatePrice($booking, $adj),
                };
            }

            $booking->load('services');
            $newTotal = $this->calculateTotal($booking->services);

            BookingServiceAdjustment::create([
                'tenant_id' => $booking->tenant_id,
                'booking_id' => $booking->id,
                'booking_service_id' => null,
                'action' => 'services_adjusted',
                'old_data' => $oldServices,
                'new_data' => $booking->services->map(fn ($s) => [
                    'id' => $s->id,
                    'service_id' => $s->service_id,
                    'name' => $s->name,
                    'price' => (float) $s->price,
                    'duration' => $s->duration,
                    'quantity' => $s->quantity,
                ])->toArray(),
                'old_total' => $oldTotal,
                'new_total' => $newTotal,
                'adjusted_by' => auth()->id() ?? 'system',
                'notes' => $notes,
            ]);

            $this->statusLogRepository->create([
                'booking_id' => $booking->id,
                'from_status' => $booking->status,
                'to_status' => $booking->status,
                'changed_by' => auth()->id() ?? 'system',
                'notes' => 'Layanan disesuaikan. Total: Rp ' . number_format($oldTotal, 0, ',', '.') . ' → Rp ' . number_format($newTotal, 0, ',', '.'),
            ]);

            event(new BookingServicesAdjusted($booking, $oldServices, $oldTotal, $newTotal));

            return $booking->fresh(['services', 'customer', 'staff', 'statusLogs']);
        });
    }

    private function validateStatus(Booking $booking): void
    {
        $allowed = ['pending', 'confirmed', 'in_progress'];

        if (! in_array($booking->status, $allowed)) {
            throw new \InvalidArgumentException('Layanan hanya dapat disesuaikan pada status: ' . implode(', ', $allowed));
        }
    }

    private function handleAdd(Booking $booking, array $adj): void
    {
        $maxSort = $booking->services->max('sort_order') ?? 0;

        $booking->services()->create([
            'tenant_id' => $booking->tenant_id,
            'service_id' => $adj['service_id'] ?? null,
            'staff_id' => $adj['staff_id'] ?? null,
            'name' => $adj['name'],
            'price' => $adj['price'] ?? 0,
            'duration' => $adj['duration'] ?? 0,
            'quantity' => $adj['quantity'] ?? 1,
            'sort_order' => $maxSort + 1,
        ]);
    }

    private function handleRemove(Booking $booking, array $adj): void
    {
        $service = $booking->services()->where('id', $adj['booking_service_id'])->firstOrFail();

        $service->addons()->delete();
        $service->delete();
    }

    private function handleUpdateQuantity(Booking $booking, array $adj): void
    {
        $service = $booking->services()->where('id', $adj['booking_service_id'])->firstOrFail();

        $service->update(['quantity' => $adj['quantity']]);
    }

    private function handleUpdatePrice(Booking $booking, array $adj): void
    {
        $service = $booking->services()->where('id', $adj['booking_service_id'])->firstOrFail();

        $service->update(['price' => $adj['price']]);
    }

    private function calculateTotal($services): float
    {
        return (float) $services->sum(fn ($s) => (float) $s->price * (int) $s->quantity);
    }
}
