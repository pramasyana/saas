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

    public function findByBooking(string $bookingId): Collection
    {
        return BookingReminder::where('booking_id', $bookingId)->get();
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
