<?php

declare(strict_types=1);

namespace App\Modules\Booking\Listeners;

use App\Modules\Booking\Events\BookingCancelled;
use Illuminate\Contracts\Queue\ShouldQueue;

class NotifyWaitingList implements ShouldQueue
{
    public function handle(BookingCancelled $event): void
    {
        // TODO: Check waiting list for same slot and notify next in line
    }
}
