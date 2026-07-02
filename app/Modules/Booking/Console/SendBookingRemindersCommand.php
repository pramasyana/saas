<?php

declare(strict_types=1);

namespace App\Modules\Booking\Console;

use App\Models\Tenant;
use App\Modules\Booking\Contracts\BookingReminderRepositoryInterface;
use App\Modules\Booking\Jobs\SendBookingReminderJob;
use Illuminate\Console\Command;

class SendBookingRemindersCommand extends Command
{
    protected $signature = 'bookings:send-reminders';

    protected $description = 'Send pending booking reminders that are due';

    public function handle(BookingReminderRepositoryInterface $reminderRepository): void
    {
        $tenants = Tenant::all();

        foreach ($tenants as $tenant) {
            $tenant->run(function () use ($reminderRepository): void {
                $reminders = $reminderRepository->getPendingReminders(tenant()->getTenantKey());

                foreach ($reminders as $reminder) {
                    if (! $reminder->scheduled_at || $reminder->scheduled_at->isFuture()) {
                        continue;
                    }

                    SendBookingReminderJob::dispatch($reminder->id);
                }
            });
        }

        $this->info('Booking reminders dispatched.');
    }
}
