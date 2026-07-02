<?php

declare(strict_types=1);

namespace App\Modules\Booking\Listeners;

use App\Modules\Booking\Events\BookingCreated;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendBookingConfirmation implements ShouldQueue
{
    public function handle(BookingCreated $event): void
    {
        // TODO: Send email/WhatsApp confirmation
        // Implementation depends on notification channel setup
    }
}
