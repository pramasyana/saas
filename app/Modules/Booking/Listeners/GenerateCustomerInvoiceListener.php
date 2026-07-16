<?php

declare(strict_types=1);

namespace App\Modules\Booking\Listeners;

use App\Modules\Booking\Events\BookingCompleted;
use App\Modules\Booking\Services\CustomerInvoiceService;
use Illuminate\Contracts\Queue\ShouldQueue;

class GenerateCustomerInvoiceListener implements ShouldQueue
{
    public function __construct(
        private readonly CustomerInvoiceService $invoiceService,
    ) {}

    public function handle(BookingCompleted $event): void
    {
        $this->invoiceService->generateFromBooking($event->booking);
    }
}
