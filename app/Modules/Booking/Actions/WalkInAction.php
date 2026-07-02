<?php

declare(strict_types=1);

namespace App\Modules\Booking\Actions;

use App\Modules\Booking\Models\Booking;
use Illuminate\Support\Facades\DB;

class WalkInAction
{
    public function __construct(
        private readonly CreateBookingAction $createBookingAction,
    ) {}

    public function execute(array $data, string $tenantId): Booking
    {
        return DB::transaction(function () use ($data, $tenantId) {
            $data['source'] = 'walk_in';
            $data['status'] = 'confirmed';

            if (empty($data['start_time'])) {
                $data['start_time'] = now();
            }

            return $this->createBookingAction->execute($data, $tenantId);
        });
    }
}
