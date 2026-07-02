<?php

declare(strict_types=1);

namespace App\Modules\Booking\Jobs;

use App\Modules\Booking\Contracts\BookingReminderRepositoryInterface;
use App\Modules\Notification\Services\MailService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendBookingReminderJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        private readonly string $reminderId,
    ) {}

    public function handle(
        BookingReminderRepositoryInterface $reminderRepository,
        MailService $mailService,
    ): void {
        $reminder = $reminderRepository->findById($this->reminderId);

        if (! $reminder || $reminder->status !== 'pending') {
            return;
        }

        $booking = $reminder->booking;

        if (! $booking || $booking->status !== 'confirmed') {
            $reminderRepository->update($reminder, ['status' => 'cancelled']);

            return;
        }

        $customer = $booking->customer;

        if (! $customer || ! $customer->email) {
            $reminderRepository->update($reminder, [
                'status' => 'failed',
                'error_message' => 'Customer has no email',
            ]);

            return;
        }

        try {
            $subject = 'Reminder: Booking '.$booking->booking_code;

            $html = view('emails.booking.reminder', [
                'booking_code' => $booking->booking_code,
                'customer_name' => $customer->name,
                'staff_name' => $booking->staff?->name,
                'branch_name' => $booking->branch?->name,
                'start_time' => $booking->start_time,
                'end_time' => $booking->end_time,
                'duration_minutes' => $booking->duration_minutes,
            ])->render();

            $mailService->send(
                toEmail: $customer->email,
                toName: $customer->name,
                subject: $subject,
                html: $html,
            );

            $reminderRepository->update($reminder, [
                'status' => 'sent',
                'sent_at' => now(),
            ]);
        } catch (\Throwable $e) {
            $reminderRepository->update($reminder, [
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);
        }
    }
}
