<?php

declare(strict_types=1);

namespace App\Modules\Booking\Contracts;

use App\Modules\Booking\Models\BookingReminder;
use Illuminate\Support\Collection;

interface BookingReminderRepositoryInterface
{
    public function create(array $data): BookingReminder;

    public function findByBooking(string $bookingId): Collection;

    public function getPendingReminders(string $tenantId): Collection;
}
