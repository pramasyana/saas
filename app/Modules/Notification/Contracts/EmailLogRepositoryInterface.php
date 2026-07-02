<?php

namespace App\Modules\Notification\Contracts;

use App\Modules\Notification\Models\EmailLog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface EmailLogRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function deleteOlderThan(string $date): int;

    public function countOlderThan(string $date): int;

    /** @return array{total_sent: int, total_failed: int, total_logs: int} */
    public function getStats(): array;

    public function create(array $data): EmailLog;

    public function getLastAttempt(int $userId, string $subject, string $channel): ?EmailLog;
}
