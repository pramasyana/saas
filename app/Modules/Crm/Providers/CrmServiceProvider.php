<?php

declare(strict_types=1);

namespace App\Modules\Crm\Providers;

use App\Modules\Crm\Contracts\CustomerNoteRepositoryInterface;
use App\Modules\Crm\Contracts\CustomerRepositoryInterface;
use App\Modules\Crm\Contracts\LoyaltyTransactionRepositoryInterface;
use App\Modules\Crm\Contracts\MembershipRepositoryInterface;
use App\Modules\Crm\Contracts\MembershipTierRepositoryInterface;
use App\Modules\Crm\Contracts\ReferralRepositoryInterface;
use App\Modules\Crm\Contracts\ReviewRepositoryInterface;
use App\Modules\Crm\Contracts\RewardRedemptionRepositoryInterface;
use App\Modules\Crm\Contracts\RewardRepositoryInterface;
use App\Modules\Crm\Contracts\TagRepositoryInterface;
use App\Modules\Crm\Contracts\TimelineEventRepositoryInterface;
use App\Modules\Crm\Repositories\CustomerNoteRepository;
use App\Modules\Crm\Repositories\CustomerRepository;
use App\Modules\Crm\Repositories\LoyaltyTransactionRepository;
use App\Modules\Crm\Repositories\MembershipRepository;
use App\Modules\Crm\Repositories\MembershipTierRepository;
use App\Modules\Crm\Repositories\ReferralRepository;
use App\Modules\Crm\Repositories\ReviewRepository;
use App\Modules\Crm\Repositories\RewardRedemptionRepository;
use App\Modules\Booking\Events\BookingCancelled;
use App\Modules\Booking\Events\BookingCheckedIn;
use App\Modules\Booking\Events\BookingCompleted;
use App\Modules\Booking\Events\BookingConfirmed;
use App\Modules\Booking\Events\BookingCreated;
use App\Modules\Booking\Events\BookingNoShow;
use App\Modules\Booking\Events\BookingRescheduled;
use App\Modules\Crm\Listeners\AwardBookingPoints;
use App\Modules\Crm\Listeners\RecordBookingTimeline;
use App\Modules\Crm\Repositories\RewardRepository;
use App\Modules\Crm\Repositories\TagRepository;
use App\Modules\Crm\Repositories\TimelineEventRepository;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class CrmServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(CustomerRepositoryInterface::class, CustomerRepository::class);
        $this->app->bind(CustomerNoteRepositoryInterface::class, CustomerNoteRepository::class);
        $this->app->bind(LoyaltyTransactionRepositoryInterface::class, LoyaltyTransactionRepository::class);
        $this->app->bind(MembershipRepositoryInterface::class, MembershipRepository::class);
        $this->app->bind(MembershipTierRepositoryInterface::class, MembershipTierRepository::class);
        $this->app->bind(ReferralRepositoryInterface::class, ReferralRepository::class);
        $this->app->bind(ReviewRepositoryInterface::class, ReviewRepository::class);
        $this->app->bind(RewardRedemptionRepositoryInterface::class, RewardRedemptionRepository::class);
        $this->app->bind(RewardRepositoryInterface::class, RewardRepository::class);
        $this->app->bind(TagRepositoryInterface::class, TagRepository::class);
        $this->app->bind(TimelineEventRepositoryInterface::class, TimelineEventRepository::class);
    }

    public function boot(): void
    {
        Event::listen(
            [BookingCreated::class, BookingConfirmed::class, BookingRescheduled::class, BookingCancelled::class, BookingCheckedIn::class, BookingCompleted::class, BookingNoShow::class],
            RecordBookingTimeline::class,
        );

        Event::listen(
            BookingCompleted::class,
            AwardBookingPoints::class,
        );
    }
}
