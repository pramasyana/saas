<?php

namespace App\Modules\Notification\Services;

use App\Modules\Notification\Contracts\EmailLogRepositoryInterface;
use Illuminate\Support\Facades\Log;

class EmailLogService
{
    public function __construct(
        private readonly EmailLogRepositoryInterface $emailLogRepository,
    ) {}

    public function paginate(array $filters = [], int $perPage = 15): mixed
    {
        return $this->emailLogRepository->paginate($filters, $perPage);
    }

    public function deleteOld(): array
    {
        $cutoff = now()->subMonths(3)->toDateTimeString();
        $count = $this->emailLogRepository->countOlderThan($cutoff);

        if ($count === 0) {
            return ['deleted' => 0];
        }

        $this->emailLogRepository->deleteOlderThan($cutoff);

        Log::info('Old email logs deleted', [
            'count' => $count,
            'cutoff' => $cutoff,
            'deleted_by' => auth()->id(),
        ]);

        return ['deleted' => $count];
    }
}
