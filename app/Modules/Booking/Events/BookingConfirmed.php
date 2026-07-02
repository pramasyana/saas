<?php

declare(strict_types=1);

namespace App\Modules\Booking\Events;

use App\Modules\Booking\Models\Booking;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BookingConfirmed
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly Booking $booking,
    ) {}
}
