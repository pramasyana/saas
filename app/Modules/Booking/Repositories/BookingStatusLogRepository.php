<?php

declare(strict_types=1);

namespace App\Modules\Booking\Repositories;

use App\Modules\Booking\Contracts\BookingStatusLogRepositoryInterface;
use App\Modules\Booking\Models\BookingStatusLog;

class BookingStatusLogRepository implements BookingStatusLogRepositoryInterface
{
    public function create(array $data): BookingStatusLog
    {
        return BookingStatusLog::create($data);
    }
}
