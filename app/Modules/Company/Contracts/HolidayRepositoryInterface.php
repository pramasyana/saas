<?php

declare(strict_types=1);

namespace App\Modules\Company\Contracts;

use App\Modules\Company\Models\Holiday;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface HolidayRepositoryInterface
{
    public function findAllByTenant(string $tenantId, array $filters = []): LengthAwarePaginator;

    public function findById(string $id): ?Holiday;

    public function create(array $data): Holiday;

    public function update(Holiday $holiday, array $data): Holiday;

    public function delete(Holiday $holiday): void;
}
