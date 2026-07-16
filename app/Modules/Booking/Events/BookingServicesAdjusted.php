<?php

declare(strict_types=1);

namespace App\Modules\Booking\Events;

use App\Modules\Booking\Models\Booking;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BookingServicesAdjusted
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly Booking $booking,
        public readonly array $oldServices,
        public readonly float $oldTotal,
        public readonly float $newTotal,
    ) {}
}
