<?php

declare(strict_types=1);

namespace App\Modules\Booking\Listeners;

use App\Modules\Booking\Events\BookingCreated;
use App\Modules\Notification\Services\MailService;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendBookingConfirmation implements ShouldQueue
{
    public function __construct(
        private readonly MailService $mailService,
    ) {}

    public function handle(BookingCreated $event): void
    {
        $booking = $event->booking;
        $customer = $booking->customer;

        if (! $customer || ! $customer->email) {
            return;
        }

        $subject = 'Booking Confirmation - '.$booking->booking_code;

        $html = view('emails.booking.confirmation', [
            'booking_code' => $booking->booking_code,
            'customer_name' => $customer->name,
            'staff_name' => $booking->staff?->name,
            'branch_name' => $booking->branch?->name,
            'start_time' => $booking->start_time,
            'end_time' => $booking->end_time,
            'duration_minutes' => $booking->duration_minutes,
            'status' => $booking->status,
            'services' => $booking->services->map(fn ($s) => [
                'name' => $s->name,
            ]),
        ])->render();

        $this->mailService->send(
            toEmail: $customer->email,
            toName: $customer->name,
            subject: $subject,
            html: $html,
        );
    }
}
