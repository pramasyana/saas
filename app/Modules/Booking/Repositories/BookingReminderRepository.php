<?php

declare(strict_types=1);

namespace App\Modules\Booking\Repositories;

use App\Modules\Booking\Contracts\BookingReminderRepositoryInterface;
use App\Modules\Booking\Models\BookingReminder;
use Illuminate\Support\Collection;

class BookingReminderRepository implements BookingReminderRepositoryInterface
{
    public function create(array $data): BookingReminder
    {
        return BookingReminder::create($data);
    }

    public function findById(string $id): ?BookingReminder
    {
        return BookingReminder::with(['booking.customer', 'booking.staff', 'booking.branch'])->find($id);
    }

    public function update(BookingReminder $reminder, array $data): BookingReminder
    {
        $reminder->update($data);

        return $reminder;
    }

    public function findByBooking(string $bookingId): Collection
    {
        return BookingReminder::where('booking_id', $bookingId)->get();
    }

    public function findByTenant(string $tenantId): Collection
    {
        return BookingReminder::whereHas('booking', fn ($q) => $q->where('tenant_id', $tenantId))
            ->with('booking.customer')
            ->get();
    }

    public function getPendingReminders(string $tenantId): Collection
    {
        return BookingReminder::where('status', 'pending')
            ->whereHas('booking', function ($q) use ($tenantId): void {
                $q->where('tenant_id', $tenantId)
                    ->where('status', 'confirmed');
            })
            ->with('booking')
            ->get();
    }
}
