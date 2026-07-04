<?php

declare(strict_types=1);

namespace App\Modules\Booking\Providers;

use App\Modules\Booking\Console\SeedAvailabilityCommand;
use App\Modules\Booking\Console\SendBookingRemindersCommand;
use App\Modules\Booking\Contracts\BookingReminderRepositoryInterface;
use App\Modules\Booking\Contracts\BookingRepositoryInterface;
use App\Modules\Booking\Contracts\BookingStatusLogRepositoryInterface;
use App\Modules\Booking\Contracts\WaitingListRepositoryInterface;
use App\Modules\Booking\Events\BookingCancelled;
use App\Modules\Booking\Events\BookingCheckedIn;
use App\Modules\Booking\Events\BookingCompleted;
use App\Modules\Booking\Events\BookingConfirmed;
use App\Modules\Booking\Events\BookingCreated;
use App\Modules\Booking\Events\BookingNoShow;
use App\Modules\Booking\Events\BookingRescheduled;
use App\Modules\Booking\Listeners\CreateBookingReminders;
use App\Modules\Booking\Listeners\NotifyWaitingList;
use App\Modules\Booking\Listeners\SendBookingConfirmation;
use App\Modules\Booking\Listeners\UpdateDashboardStats;
use App\Modules\Booking\Repositories\BookingReminderRepository;
use App\Modules\Booking\Repositories\BookingRepository;
use App\Modules\Booking\Repositories\BookingStatusLogRepository;
use App\Modules\Booking\Repositories\WaitingListRepository;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class BookingServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(BookingRepositoryInterface::class, BookingRepository::class);
        $this->app->bind(WaitingListRepositoryInterface::class, WaitingListRepository::class);
        $this->app->bind(BookingStatusLogRepositoryInterface::class, BookingStatusLogRepository::class);
        $this->app->bind(BookingReminderRepositoryInterface::class, BookingReminderRepository::class);

        $this->commands([
            SeedAvailabilityCommand::class,
            SendBookingRemindersCommand::class,
        ]);
    }

    public function boot(): void
    {
        Event::listen(BookingCreated::class, SendBookingConfirmation::class);
        Event::listen(BookingCreated::class, CreateBookingReminders::class);
        Event::listen(BookingCreated::class, UpdateDashboardStats::class);
        Event::listen(BookingConfirmed::class, UpdateDashboardStats::class);
        Event::listen(BookingRescheduled::class, UpdateDashboardStats::class);
        Event::listen(BookingNoShow::class, UpdateDashboardStats::class);
        Event::listen(BookingCancelled::class, NotifyWaitingList::class);
        Event::listen(BookingCancelled::class, UpdateDashboardStats::class);
        Event::listen(BookingCheckedIn::class, UpdateDashboardStats::class);
        Event::listen(BookingCompleted::class, UpdateDashboardStats::class);
    }
}
