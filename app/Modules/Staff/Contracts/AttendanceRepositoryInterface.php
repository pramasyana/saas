<?php

declare(strict_types=1);

namespace App\Modules\Staff\Contracts;

use App\Modules\Staff\Models\Attendance;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface AttendanceRepositoryInterface
{
    public function paginate(string $tenantId, array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function findById(string $id): ?Attendance;
    public function findByStaffAndDate(string $tenantId, string $staffId, string $date): ?Attendance;
    public function create(array $data): Attendance;
    public function update(Attendance $attendance, array $data): Attendance;
    public function delete(Attendance $attendance): bool;
    public function getStats(string $tenantId, ?string $date = null): array;
}
