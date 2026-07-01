<?php

namespace App\Modules\Notification\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface EmailLogRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function deleteOlderThan(string $date): int;

    public function countOlderThan(string $date): int;
}
