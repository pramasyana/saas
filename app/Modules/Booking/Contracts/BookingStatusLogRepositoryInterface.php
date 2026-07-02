<?php

declare(strict_types=1);

namespace App\Modules\Booking\Contracts;

use App\Modules\Booking\Models\BookingStatusLog;

interface BookingStatusLogRepositoryInterface
{
    public function create(array $data): BookingStatusLog;
}
