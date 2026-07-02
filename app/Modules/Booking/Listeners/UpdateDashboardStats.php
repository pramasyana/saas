<?php

declare(strict_types=1);

namespace App\Modules\Booking\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;

class UpdateDashboardStats implements ShouldQueue
{
    public function handle(object $event): void
    {
        // TODO: Update cached dashboard booking stats
    }
}
