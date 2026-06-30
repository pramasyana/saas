<?php

namespace App\Modules\Admin\Repositories;

use App\Models\User;
use App\Modules\Admin\Contracts\UserRepositoryInterface;
use Illuminate\Support\Collection;

class UserRepository implements UserRepositoryInterface
{
    public function count(): int
    {
        return User::count();
    }

    public function countWhereDate(string $column, string $operator, string $date): int
    {
        return User::whereDate($column, $operator, $date)->count();
    }

    /** @param array<string> $dates */
    public function countWhereBetween(string $column, array $dates): int
    {
        return User::whereBetween($column, $dates)->count();
    }

    public function countWhere(string $column, mixed $value): int
    {
        return User::where($column, $value)->count();
    }

    public function countByDayOfWeek(string $column, int $day): int
    {
        return User::whereDay($column, $day)->count();
    }

    /** @return Collection<int, User> */
    public function latest(int $limit): Collection
    {
        return User::latest()->take($limit)->get();
    }

    public function findById(int $id): ?User
    {
        return User::find($id);
    }
}
