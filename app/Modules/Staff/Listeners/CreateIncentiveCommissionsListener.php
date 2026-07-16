<?php

declare(strict_types=1);

namespace App\Modules\Staff\Listeners;

use App\Modules\Booking\Events\BookingCompleted;
use App\Modules\Staff\Actions\CreateIncentiveCommissionsAction;

class CreateIncentiveCommissionsListener
{
    public function __construct(
        private CreateIncentiveCommissionsAction $action,
    ) {}

    public function handle(BookingCompleted $event): void
    {
        $this->action->execute($event->booking);
    }
}
