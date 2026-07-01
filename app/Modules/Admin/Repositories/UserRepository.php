<?php

namespace App\Modules\Admin\Repositories;

use App\Models\User;
use App\Modules\Admin\Contracts\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
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

    /** @param array<string, mixed> $filters */
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = User::with('tenant');

        if (! empty($filters['search'])) {
            $query->where(function ($q) use ($filters): void {
                $q->where('name', 'like', "%{$filters['search']}%")
                    ->orWhere('email', 'like', "%{$filters['search']}%");
            });
        }

        if (isset($filters['is_admin'])) {
            $query->where('is_admin', $filters['is_admin']);
        }

        if (! empty($filters['sort'])) {
            $query->orderBy($filters['sort'], $filters['direction'] ?? 'asc');
        } else {
            $query->latest();
        }

        return $query->paginate($perPage);
    }

    public function create(array $data): User
    {
        return User::create($data);
    }

    public function update(User $user, array $data): User
    {
        $user->update($data);

        return $user;
    }

    public function delete(User $user): bool
    {
        return $user->delete();
    }

    public function getStats(): array
    {
        return [
            'total_users' => User::count(),
            'total_admins' => User::where('is_admin', true)->count(),
            'new_this_month' => User::whereMonth('created_at', now()->month)->count(),
        ];
    }
}
