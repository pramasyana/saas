<?php

namespace App\Modules\Admin\Contracts;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface UserRepositoryInterface
{
    public function count(): int;

    public function countWhereDate(string $column, string $operator, string $date): int;

    /** @param array<string> $dates */
    public function countWhereBetween(string $column, array $dates): int;

    public function countWhere(string $column, mixed $value): int;

    public function countByDayOfWeek(string $column, int $day): int;

    /** @return Collection<int, User> */
    public function latest(int $limit): Collection;

    public function findById(string $id): ?User;

    /** @param array<string, mixed> $filters */
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function create(array $data): User;

    public function update(User $user, array $data): User;

    public function delete(User $user): bool;

    /** @return array{total_users: int, total_admins: int, new_this_month: int} */
    public function getStats(): array;
}
