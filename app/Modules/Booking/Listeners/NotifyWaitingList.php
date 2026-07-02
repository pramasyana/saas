<?php

declare(strict_types=1);

namespace App\Modules\Booking\Listeners;

use App\Modules\Booking\Contracts\WaitingListRepositoryInterface;
use App\Modules\Booking\Events\BookingCancelled;
use App\Modules\Notification\Services\MailService;
use Illuminate\Contracts\Queue\ShouldQueue;

class NotifyWaitingList implements ShouldQueue
{
    public function __construct(
        private readonly WaitingListRepositoryInterface $waitingListRepository,
        private readonly MailService $mailService,
    ) {}

    public function handle(BookingCancelled $event): void
    {
        $booking = $event->booking;

        $waitingEntries = $this->waitingListRepository->getWaitingByDate(
            $booking->tenant_id,
            $booking->start_time->format('Y-m-d'),
        );

        $target = $waitingEntries->first();

        if (! $target) {
            return;
        }

        $this->waitingListRepository->update($target, [
            'status' => 'notified',
            'notified_at' => now(),
        ]);

        $customer = $target->customer;

        if ($customer && $customer->email) {
            $subject = 'Slot Tersedia - Booking';
            $html = view('emails.booking.slot-available', [
                'customer_name' => $customer->name,
                'service_name' => $target->service?->name,
                'preferred_date' => $target->preferred_date,
                'preferred_time' => $target->preferred_time,
            ])->render();

            $this->mailService->send(
                toEmail: $customer->email,
                toName: $customer->name,
                subject: $subject,
                html: $html,
            );
        }
    }
}
